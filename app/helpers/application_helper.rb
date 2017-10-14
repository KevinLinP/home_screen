module ApplicationHelper

  def camelcase_keys(hash)
    hash.map do |key, value|
      [key.to_s.camelcase(:lower), value]
    end.to_h
  end

  def unix_time_milliseconds(time)
    case time
    when Integer
      time * 1000
    when DateTime, Time
      unix_time_milliseconds(time.to_i) # lol, ahahahahhahahahahaha
    else
      raise NotImplementedError.new
    end
  end

  def iso_date(date)
    return nil unless date

    case date
    when Date
      date.iso8601
    else
      raise NotImplementedError.new
    end
  end

end
