class Link < Listable
  store_accessor :data, [:name, :url, :image]

  validates :name, :url, :image, presence: true
end
