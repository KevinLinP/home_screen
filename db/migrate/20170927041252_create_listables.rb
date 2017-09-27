class CreateListables < ActiveRecord::Migration[5.1]
  def change
    create_table :listables do |t|
      t.string :type, null: false
      t.integer :position, null: false
      t.json :data, null: false

      t.index :type
      t.index [:type, :position], unique: true

      t.timestamps
    end
  end
end
