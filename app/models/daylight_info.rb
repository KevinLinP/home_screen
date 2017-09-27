class DaylightInfo
  include DaylightInfo::RawData
  PST_OFFSET = '-8'

  def next_week
    data = []

    date = Date.today
    7.times do
      day_data = table_data[date.year][date.month][date.day]

      day_data.each do |type, time|
        hour = time.slice(0, 2).to_i
        minutes = time.slice(2, 2).to_i
        timestamp = DateTime.new(date.year, date.month, date.day, hour, minutes, 0, PST_OFFSET)
        timestamp = timestamp.in_time_zone('Pacific Time (US & Canada)') # converts PST to appropriate PST/PDT

        data << {type: type, timestamp: timestamp}
      end

      date = date.next_day
    end

    data
  end

  protected

  def table_data
    @@data ||= calculate_table_data
  end

  def calculate_table_data
    data = {}
    data[2017] ||= {}

    day = 1
    DaylightInfo::RawData::SEATTLE_2017_PST.each_line do |line|
      (1..12).each do |month|
        start_index = (month - 1) * 11
        sunrise, sunset = line.slice(start_index, 11).split(' ')

        data[2017][month] ||= {}
        if sunrise.present?
          data[2017][month][day] = {sunrise: sunrise, sunset: sunset}
        end
      end

      day += 1
    end

    data
  end

end
