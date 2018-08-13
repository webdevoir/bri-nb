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

require 'test_helper'

class HomeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
