class NicehashesController < ApplicationController
  include ApplicationHelper

  def show
    stats = Nicehash.new.stats.clone
    if stats
      stats[:timestamp] = unix_time_milliseconds(stats[:timestamp])
      stats = camelcase_keys(stats)

      render json: stats
    else
      render head: :service_unavailable
    end
  end

end
