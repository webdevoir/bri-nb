# == Schema Information
#
# Table name: reviews
#
#  id         :bigint(8)        not null, primary key
#  home_id    :integer          not null
#  user_id    :integer          not null
#  rating     :integer          not null
#  body       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Review < ApplicationRecord
    validates :rating, inclusion: { in: (1..5) }
    validates :body, presence: true

    belongs_to :home,
        foreign_key: :home_id,
        class_name: :Home 

    belongs_to :user,
        foreign_key: :user_id,
        class_name: :User
end
