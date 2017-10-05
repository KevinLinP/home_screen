class Nicehash
  extend Memoist

  def stats
    Rails.cache.fetch('nicehash_stats', expires_in: 5.minutes) do
      stats = calculate_earned
      stats[:timestamp] = DateTime.now.to_i
      stats[:mbtc_per_usd] = mbtc_per_usd

      stats
    end
  end

  protected

  def mbtc_per_usd
    # TODO: better error handling
    Rails.cache.fetch('mbtc_per_usd', expires_in: 15.minutes) do
      url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
      response = RestClient.get(url)

      data = JSON.parse(response.body, symbolize_names: true)
      usd_per_btc = BigDecimal.new(data[:bpi][:USD][:rate].gsub(',', ''))

      (BigDecimal.new(1_000_000) / usd_per_btc).round(2)
    end
  end

  # https://www.nicehash.com/doc-api
  # 'snapshots' is a _sparse_ array of historic data
  # TODO: break up into smaller methods
  # TODO: for fun, generalize for any period of time
  def calculate_earned
    algos = raw_data[:result][:past]
    now_balance = BigDecimal.new(0)
    hour_ago_balance = BigDecimal.new(0)
    day_ago_balance = BigDecimal.new(0)

    hour_ago_timestamp = (1.hour.ago.to_i / 300).floor # NiceHash returns timestamps based off of 5-minute increments :S
    day_ago_timestamp = (1.day.ago.to_i / 300).floor

    algos.each do |algo_data|
      # this code is intentionally readability-optimized.
      snapshots = algo_data[:data].sort_by!(&:first)

      now_snapshot = snapshots.last
      hour_ago_snapshot = snapshots.last
      day_ago_snapshot = snapshots.last

      # going from newest to oldest
      snapshots.reverse_each do |snapshot|
        timestamp = snapshot[0]

        if (timestamp > hour_ago_timestamp) && (timestamp < hour_ago_snapshot[0])
          hour_ago_snapshot = snapshot
        end

        if (timestamp > day_ago_timestamp) && (timestamp < day_ago_snapshot[0])
          day_ago_snapshot = snapshot
        end
      end

      now_balance += BigDecimal.new(now_snapshot[2])
      hour_ago_balance += BigDecimal.new(hour_ago_snapshot[2])
      day_ago_balance += BigDecimal.new(day_ago_snapshot[2])
    end

    {
      last_hour_earned: (now_balance - hour_ago_balance),
      last_day_earned: (now_balance - day_ago_balance)
    }
  end

  # https://www.nicehash.com/doc-api
  def raw_data
    url = "https://api.nicehash.com/api?method=stats.provider.ex&addr=#{Rails.application.secrets.nicehash_btc_address}&from=#{24.hours.ago.strftime('%s')}"

    response = RestClient.get(url)
    return nil unless response.code == 200

    JSON.parse(response.body, symbolize_names: true)
  end
  memoize :raw_data

end
