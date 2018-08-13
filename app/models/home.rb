# == Schema Information
#
# Table name: homes
#
#  id                  :bigint(8)        not null, primary key
#  host_id             :integer          not null
#  name                :string           not null
#  city                :string           not null 
#  max_guests          :integer          not null
#  num_rooms           :integer          not null
#  num_beds            :integer          not null
#  num_baths           :integer          not null
#  description         :text             not null
#  house_rules         :text
#  cancellation_policy :text             not null
#  latitude            :float            not null
#  longitude           :float            not null
#  price               :float            not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class Home < ApplicationRecord
    validates :name, :city, :max_guests, :num_rooms, :num_baths, :num_beds, :description,
        :cancellation_policy, :latitude, :longitude, :price, presence: true

    belongs_to :host,
        foreign_key: :host_id,
        class_name: :User

    # has_many :reservations,
    #     foreign_key: :home_id,
    #     class_name: :Reservation

    # has_many :amenities,
    #     foreign_key: :home_id,
    #     class_name: :Amenity


end
