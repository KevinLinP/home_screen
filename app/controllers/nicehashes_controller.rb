class NicehashesController < ApplicationController
  include ApplicationHelper

  def show
    stats = Nicehash.new.stats.clone
    stats[:timestamp] = unix_time_milliseconds(stats[:timestamp])
    stats = camelcase_keys(stats)

    render json: stats
  end

end
