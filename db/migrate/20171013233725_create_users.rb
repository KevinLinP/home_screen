class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.json :data, null: false

      t.timestamps null: false
    end
  end
end
