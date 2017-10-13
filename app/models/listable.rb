class Listable < ActiveRecord::Base
  acts_as_list scope: [:type], top_of_list: 0

  validates :type, :data, presence: true

  after_initialize :set_defaults

  protected

  def set_defaults
    # intentionally empty
  end

end
