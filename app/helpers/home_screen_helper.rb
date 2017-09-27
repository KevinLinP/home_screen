module HomeScreenHelper

  def daylight_info
    DaylightInfo.new.next_week.map do |data|
      data[:timestamp] = data[:timestamp].to_i * 1000

      data
    end
  end

end
