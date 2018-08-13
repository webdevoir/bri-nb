class CreateHomes < ActiveRecord::Migration[5.2]
  def change
    create_table :homes do |t|
      t.integer :host_id, null: false
      t.string :name, null: false
      t.string :city, null: false
      t.integer :max_guests, null: false
      t.integer :num_rooms, null: false
      t.integer :num_beds, null: false
      t.integer :num_baths, null: false
      t.text :description, null: false
      t.text :house_rules
      t.text :cancellation_policy, null: false
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.float :price, null: false
      t.timestamps
    end
    add_index :homes, :host_id
    add_index :homes, :name
  end
end
