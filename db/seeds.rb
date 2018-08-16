# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Seed Users
demo = User.create(email: "demo@demo.com", password: "123123", first_name: "Demo", last_name: "User")
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
    description: "The guest apartment has its own entrance located on the ground level of our home. The private apartment is 720 sq ft and has 8 ft ceilings. The living room and kitchen are new as of 2013 and the bath and the two bedrooms are remodeled.",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.799021,
    longitude: -122.40149,
    price: 70.00
)

m2 = Home.create(
    host_id: u2.id,
    name: "AVA Nob Hill",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "Private entry, sidewalk-level suite of living room, kitchen, bedroom and bath with artful touches in 1911 Edwardian. Close to beaches, GGate Park, GGate Bridge, groceries, cafes, restaurants on city-wide trolly line for memorable vacation/business/retreat. Easy drive to Marin.",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.788252,
    longitude: -122.416318,
    price: 70.00
)

m3 = Home.create(
    host_id: u3.id,
    name: "Burma Love",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "My sunny, 3-story Victorian house is in tranquil Noe Valley, 1 mile from the heart of Mission District, with easy access by streetcar to downtown. Many restaurants are within easy walking distance, and weather is sunnier than much of SF! Your light-filled bedroom has a queen-sized bed and access to a bathroom with shower and tub (shared with other guests). Free street parking available with some restrictions.",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.76962,
    longitude: -122.42205,
    price: 70.00
)

m4 = Home.create(
    host_id: u4.id,
    name: "Studio with Awesome View",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "Come share our Cozy Artsy home in SF's Portola District. One bedroom available in a home with our family and two cats. We live in home. 2 min walk to bus & 15 min ride to subway. 15 drive downtown or 45 min on public transit. Walk out front door & head out on a hike in Maclaren Park.... come enjoy a quiet get away from the hubbub of the City... we are not super close to tourist area but it's a sweet neighborhood. Lots of street parking!",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.807175,
    longitude: -122.42017,
    price: 100.00
)

m5 = Home.create(
    host_id: u1.id,
    name: "Spacious condo in Noe Valley",
    city: "San Francisco",
    max_guests: 4,
    num_rooms: 2,
    num_beds: 3,
    num_baths: 4,
    description: "Immaculate, spacious lower level private room with private entrance and adjacent parking. Comfortable queen bed and attached spa like bath with tub/shower. Studio like feel with 40'' TV, microwave and refrigerator. Use of backyard, washer & dryer.",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.751677,
    longitude: -122.432468,
    price: 120.00
)

m6 = Home.create(
    host_id: u2.id,
    name: "Shady, Dangerous Patio in SoMa",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "We are located in the San Francisco neighborhood of Mission Terrace district. Our street is quiet but located next to the main street Mission. If you are coming by public transit, the Balboa Park Bart station is within 1 mile. Or there is a No.14 bus stop right around the corner within 1 min walking, which will lead you to downtown trough Mission St. We can provide a car to pick up or drop off by the SFO at a reasonable price $30",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.779879,
    longitude: -122.405480,
    price: 20.00
)

m7 = Home.create(
    host_id: u3.id,
    name: "Packed, Touristy Apartment in Russian Hill",
    city: "San Francisco",
    max_guests: 6,
    num_rooms: 3,
    num_beds: 3,
    num_baths: 4,
    description: "This is a very very small room in a historic Victorian house with a Twin size bed 2 blocks from the famous Haight and Ashbury cross streets.
Accommodates one person only.

• Twin size bed
• Baseboard Heater
• High Speed Internet",
    house_rules: "No smoking please",
    cancellation_policy: "Full refund within 24 hours of booking",
    latitude: 37.801911,
    longitude: -122.418704,
    price: 100.00
)