module CrudController
  def index
    @props = CrudHelper::index(controller_name, current_account, params)
    render 'crud/index'
  end

  def delete
    render :json => CrudHelper::delete_unit(controller_name.classify.constantize, params)
  end

  def update
    render :json => CrudHelper::edit_unit(controller_name.classify.constantize, params)
  end

  def create
    render :json => CrudHelper::new_unit(controller_name.classify.constantize, params)
  end

  def reload
    data = CrudHelper::index(controller_name, current_account, params)
    render json: data[:data]
  end
end