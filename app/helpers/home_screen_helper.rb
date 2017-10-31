module HomeScreenHelper
  include ApplicationHelper
  SEATTLE_LATITUDE = 47.639469
  SEATTLE_LONGITUDE = -122.325989

  def todos
    # yes, it's weird that as_json actually returns a (json-ready) hash
    Todo.all.as_json(only: [:id, :position], methods: [:text, :completed])
  end

end
