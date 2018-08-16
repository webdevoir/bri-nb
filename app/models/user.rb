# == Schema Information
#
# Table name: users
#
#  id              :bigint(8)        not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  first_name      :string           not null
#  last_name       :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ApplicationRecord
    attr_reader :password

    validates :email, :password_digest, :session_token, :first_name, :last_name, presence: true
    validates :password, length: { minimum: 6, allow_nil: true }
    validates :email, uniqueness: true
    after_initialize :ensure_session_token

    has_many :reviews,
        foreign_key: :user_id,
        class_name: :Review
    
    def self.find_by_credentials(email, password)
        user = User.find_by(email: email)
		return nil unless user
		user.is_password?(password) ? user : nil
    end

    def password=(value)
        self.password_digest = BCrypt::Password.create(value)
		@password = value
    end

    def is_password?(password)
        BCrypt::Password.new(self.password_digest).is_password?(password)
    end

    def reset_session_token!
        self.session_token = SecureRandom.urlsafe_base64
        self.save!
        self.session_token
    end

    private

    def ensure_session_token
        self.session_token ||= SecureRandom.urlsafe_base64
    end
    
end
