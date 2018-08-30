module ImageCrud
  def new
    model = controller_name.classify.constantize
    path = model::write_file params[:image]
    image = model.new(extension: File.extname(path), path: path)

    render :json => {result: :failed, messages: image.errors.messages} unless image.valid?
    render :json => {result: :ok, id: image.id} if image.save
  end

  def delete
    model = controller_name.classify.constantize
    model.find(params[:id]).destroy
    render :json => {result: :ok}
  end
end