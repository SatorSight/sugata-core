class AdminController < ApplicationController
  def index
    @props = {
        role: current_account.highest_role,
        action: :home,
        data: Issue::serialize_for_dashboard( Issue::get_last(48))
    }
  end
end