class RedditsController < ApplicationController
  include ApplicationHelper

  def show
    render_show
  end

  def update
    date = Date.parse(params['lastRead'])
    User.instance.update!(reddit_last_read: date)

    render_show
  end

  protected

  def render_show
    data = Reddit.new.tldr.clone

    data[:date] = iso_date(data[:date])

    data[:last_read] = User.instance.reddit_last_read
    if data[:last_read]
      data[:last_read] = iso_date(Date.parse(data[:last_read]))
    end

    render json: camelcase_keys(data)
  end

end
