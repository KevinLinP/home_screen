class Listable < ActiveRecord::Base
  # TODO: use acts_as_list or similar
  validates :type, :data, presence: true
  validates :position, uniqueness: {scope: :type}

  after_initialize :set_defaults

  protected

  def set_defaults
    # intentionally empty
  end
end
