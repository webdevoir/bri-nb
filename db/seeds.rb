# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Seed Users
u1 = User.create(email: "brianjeong55@gmail.com", password: "123123", first_name: "Brian", last_name: "Jeong")
u2 = User.create(email: "angjeong@gmail.com", password: "123123", first_name: "Angelina", last_name: "Jeong")
u3 = User.create(email: "tsj11@gmail.com", password: "123123", first_name: "Terry", last_name: "Jeong")
u4 = User.create(email: "jenny@gmail.com", password: "123123", first_name: "Jenny", last_name: "Jeong")

#Seed Locations
m1 = Home.create(
    host_id: u1.id,
    name: "Beautiful vista in Financial District",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "An awesome place to vacation",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.799021,
    longitude: -122.40149,
    price: 70.00
)

m1 = Home.create(
    host_id: u2.id,
    name: "AVA Nob Hill",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "An awesome place to vacation",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.788252,
    longitude: -122.416318,
    price: 70.00
)

m1 = Home.create(
    host_id: u3.id,
    name: "Burma Love",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "An awesome place to vacation",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.76962,
    longitude: -122.42205,
    price: 70.00
)