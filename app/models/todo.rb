class Todo < Listable
  store_accessor :data, [:text, :completed]

  validates :text, presence: true
  validates :completed, inclusion: [true, false]

  protected

  def set_defaults
    self.completed ||= false
  end

end
