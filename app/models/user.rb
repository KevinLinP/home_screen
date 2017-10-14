class User < ActiveRecord::Base
  store_accessor :data, [:reddit_last_read]

  validates :data, exclusion: {in: [nil]} # derp.

  before_validation :set_defaults

  def self.instance
    all = self.all.to_a

    case all.length
    when 0
      create!
    when 1
      all.first
    else
      raise Exception.new('multiple users found')
    end
  end
  
  protected

  def set_defaults
    self.data ||= {}
  end
end
