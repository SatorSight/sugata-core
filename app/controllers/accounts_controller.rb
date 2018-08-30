class AccountsController < ApplicationController
  include CrudController
  #
  # def index
  #   @props = {
  #       role: current_account.highest_role,
  #       action: :accounts,
  #       data: {
  #           columns: Account::cols,
  #           rows: Account::to_rows(Account.all)
  #       },
  #       realms: Realm.all,
  #       roles: Role.all
  #   }
  # end
  #
  # def add
  #   result = Account.make_with params
  #
  #   if result.is_a? TrueClass
  #     json = {result: :ok}
  #   else
  #     json = {
  #         result: :failed,
  #         messages: result
  #     }
  #   end
  #
  #   render :json => json
  # end
end