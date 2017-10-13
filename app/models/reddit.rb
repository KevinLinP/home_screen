require 'chronic'

class Reddit
  extend Memoist

  def tldr
    Rails.cache.fetch('reddit_tldr', expires_in: 15.minutes) do
      data
    end
  end

  protected

  def data
    data = raw_data[:data][:children].first[:data]

    data = [:title, :url].map do |field|
      [field, data[field]]
    end.to_h

    data[:date] = data[:title].match(/^\[(.+)\]/).captures.first
    data[:date] = Chronic.parse(data[:date]).to_date

    data[:title].gsub!(/^\[.+\]\s/, '') # removes date

    data
  end

  # https://www.nicehash.com/doc-api
  def raw_data
    url = "https://www.reddit.com/r/tldr/new.json?limit=1"

    response = RestClient.get(url)
    return nil unless response.code == 200

    JSON.parse(response.body, symbolize_names: true)
  end
  memoize :raw_data

end
