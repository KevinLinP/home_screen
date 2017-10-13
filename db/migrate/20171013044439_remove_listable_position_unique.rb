class RemoveListablePositionUnique < ActiveRecord::Migration[5.1]
  def change
    remove_index(:listables, column: [:type, :position])
  end
end
