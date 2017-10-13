class Link < Listable
  store_accessor :data, [:name, :url, :image]
  before_validation :fill_position

  validates :position, :name, :url, :image, presence: true

  protected

  def fill_position
    self.position ||= begin
      link_positions = Link.all.pluck(:position)
      link_positions.present? ? (link_positions.max + 1) : 0
    end
  end
end
