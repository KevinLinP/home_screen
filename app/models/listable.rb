class Listable < ActiveRecord::Base
  # TODO: consider acts_as_list or similar
  validates :type, :position, :data, presence: true
  validates :position, uniqueness: {scope: :type} # cannot be db-enforced =(

  after_initialize :set_defaults
  before_validation :fill_position

  protected

  def set_defaults
    # intentionally empty
  end

  # abstract ... method?
  def fill_position
    self.position ||= begin
      link_positions = self.class.all.pluck(:position)
      link_positions.present? ? (link_positions.max + 1) : 0
    end
  end
end
