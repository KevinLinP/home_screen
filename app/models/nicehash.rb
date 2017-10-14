class Nicehash
  extend Memoist

  CACHE_KEY = 'nicehash_stats'

  def stats
    if data = Rails.cache.read(CACHE_KEY)
      return data
    end

    if raw_data[:result][:error].present?
      return nil
    end

    stats = calculate_earned
    stats[:timestamp] = now.to_i
    stats[:mbtc_per_usd] = mbtc_per_usd

    Rails.cache.write(CACHE_KEY, stats, expires_in: 3.minutes)

    stats
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
    now_balance = BigDecimal.new(0)
    hour_ago_balance = BigDecimal.new(0)
    day_ago_balance = BigDecimal.new(0)

    algos = raw_data[:result][:past]
    algos.each do |algo_data|
      balances = get_algo_balances(algo_data)

      now_balance += balances[:now]
      hour_ago_balance += balances[:hour_ago]
      day_ago_balance += balances[:day_ago]
    end

    raw_data[:result][:payments].each do |payment_data|
      timestamp = DateTime.strptime(payment_data[:time].to_s, '%s')
      earned_amount = BigDecimal.new(payment_data[:amount]) + BigDecimal.new(payment_data[:fee])

      if timestamp > (now - 1.hour)
        hour_ago_balance -= earned_amount
      end

      if timestamp > (now - 1.day)
        day_ago_balance -= earned_amount
      end
    end

    {
      last_hour_earned_mbtc: ((now_balance - hour_ago_balance) * 1_000_000).round(2),
      last_day_earned_mbtc: ((now_balance - day_ago_balance) * 1_000_000).round(2)
    }
  end

  def get_algo_balances(algo_data)
    # this code is intentionally readability-optimized.
    snapshots = algo_data[:data].sort_by!(&:first)

    now_snapshot = snapshots.last
    hour_ago_snapshot = snapshots.last
    day_ago_snapshot = snapshots.last

    # going from newest to oldest
    snapshots.reverse_each do |snapshot|
      timestamp = snapshot[0]

      if (timestamp > hour_ago_nicehash_timestamp) && (timestamp < hour_ago_snapshot[0])
        hour_ago_snapshot = snapshot
      end

      if (timestamp > day_ago_nicehash_timestamp) && (timestamp < day_ago_snapshot[0])
        day_ago_snapshot = snapshot
      end
    end

    {
      now: BigDecimal.new(now_snapshot[2]),
      hour_ago: BigDecimal.new(hour_ago_snapshot[2]),
      day_ago: BigDecimal.new(day_ago_snapshot[2])
    }
  end

  def now
    DateTime.now
  end
  memoize :now

# NiceHash returns timestamps based off of 5-minute increments :S
  def hour_ago_nicehash_timestamp
    ((now - 1.hour).to_i / 5.minutes.to_i).floor 
  end
  memoize :hour_ago_nicehash_timestamp

  def day_ago_nicehash_timestamp
    ((now - 1.day).to_i / 5.minutes.to_i).floor
  end
  memoize :day_ago_nicehash_timestamp

  # https://www.nicehash.com/doc-api
  def raw_data
    url = "https://api.nicehash.com/api?method=stats.provider.ex&addr=#{Rails.application.secrets.nicehash_btc_address}&from=#{24.hours.ago.strftime('%s')}"

    response = RestClient.get(url)
    return nil unless response.code == 200

    JSON.parse(response.body, symbolize_names: true)
  end
  memoize :raw_data

end
