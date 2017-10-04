class Listable < ActiveRecord::Base
  validates :type, :data, presence: true
  validates :position, uniqueness: {scope: :type}

  after_initialize :set_defaults

  protected

  def set_defaults
    # intentionally empty
  end
end
