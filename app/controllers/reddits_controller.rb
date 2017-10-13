class RedditsController < ApplicationController
  include ApplicationHelper

  def show
    data = Reddit.new.tldr.clone

    data[:date] = iso_date(data[:date])
    data = camelcase_keys(data)

    render json: data
  end

end
