class MakeListablePositionNullable < ActiveRecord::Migration[5.1]
  def change
    change_column_null :listables, :position, true
  end
end
