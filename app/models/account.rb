class Account < ApplicationRecord
  include CrudModel

  ADMIN = 'ADMIN'.freeze
  MANAGER = 'MANAGER'.freeze
  CONTENT = 'CONTENT'.freeze

  devise :database_authenticatable,
         :rememberable,
         :trackable,
         :registerable,
         :authentication_keys => [:login]

  belongs_to :realm
  has_and_belongs_to_many :roles

  validates_presence_of :realm
  validates_presence_of :login
  validates_presence_of :password

  validates_uniqueness_of :login

  validates :password, length: { in: 6..20 }

  def highest_role
    self_role_keys = []
    self.roles.each {|role| self_role_keys.push role.key}

    [ADMIN, MANAGER, CONTENT].each do |role|
      return role if self_role_keys.include? role
    end
    throw 'User roles not found!'
  end



  def highest_role_name
    Role.where(key: self.highest_role).take.name
  end

  # def self.cols
  #   id =
  #   {
  #       id: :id,
  #       numeric: false,
  #       disablePadding: false,
  #       label: :ID
  #   }
  #
  #   login =
  #   {
  #       id: :login,
  #       numeric: false,
  #       disablePadding: false,
  #       label: :Login
  #   }
  #   created_at =
  #   {
  #       id: :created_at,
  #       numeric: false,
  #       disablePadding: false,
  #       label: :Created
  #   }
  #   realm =
  #   {
  #       id: :realm,
  #       numeric: false,
  #       disablePadding: false,
  #       label: :Realm
  #   }
  #   email =
  #   {
  #       id: :email,
  #       numeric: false,
  #       disablePadding: true,
  #       label: :Email
  #   }
  #   role = {
  #       id: :role,
  #       numeric: false,
  #       disablePadding: true,
  #       label: :Role
  #   }
  #
  #   [id, login, created_at, realm, email, role]
  # end
  #
  # def self.to_rows(accounts)
  #   rows = []
  #   accounts.each do |account|
  #     row = {
  #         id: account.id,
  #         login: account.login,
  #         created_at: account.created_at.to_s,
  #         realm: account.realm.name,
  #         email: account.email,
  #         role: account.highest_role_name
  #     }
  #     rows.push row
  #   end
  #   rows
  # end

  # def self.make_with(params)
  #   req = JSON.parse params['json']
  #
  #   login = req['login']
  #   password = req['password']
  #   realm = Realm.find req['realm']
  #   role = Role.find req['role']
  #
  #   new_account = Account.new(
  #     login: login,
  #     password: password,
  #     realm: realm,
  #     roles: [role]
  #   )
  #
  #   unless new_account.valid?
  #     return new_account.errors.messages
  #   end
  #
  #   return new_account.save
  # end
end