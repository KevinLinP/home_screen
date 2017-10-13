class ListablePositionNotNullableAndIndex < ActiveRecord::Migration[5.1]
  def change
    change_column_null :listables, :position, false
    add_index :listables, :position
  end
end
