class UpcomingEvent < Listable
  store_accessor :data, [:name, :date]
  validates :name, :date, presence: true

  before_validation :parse_date
  validate :date_type

  protected

  def date_type
    unless self.date.is_a?(Date)
      errors.add(:date, 'date must be a Date object')
    end
  end

  def parse_date
    case self.date
    when String
      self.date = Chronic.parse(self.date).to_date
    end
  end

end
