module CrudHelper

  # defaults
  DEFAULT_SORT_BY = 'id'.freeze
  DEFAULT_SORT = 'desc'
  DEFAULT_PAGE = 0
  DEFAULT_PAGE_SIZE = 25

  def self.delete_unit(klass, params)
    ids = []
    JSON.parse(params[:ids]).each {|p| ids.push Integer(p)}
    Object.const_get(klass.to_s).destroy ids
    {result: :ok}
  end

  def self.new_unit(klass, params)
    params = JSON.parse params[:json]
    object = Object.const_get(klass.to_s).new
    callbacks = self.set_fields(klass, params, object)

    return self::finalize(object, callbacks)
  end

  def self.edit_unit(klass, params)
    params = JSON.parse params[:json]
    object = Object.const_get(klass.to_s).find params['id']
    callbacks = self.set_fields(klass, params, object)

    return self::finalize(object, callbacks)
  end

  def self.index(controller_name, current_account, params)
    model = controller_name.classify.constantize.new
    params_hash = self.params_hash(params)

    cols = model.cols
    fields = model.model_fields
    rows = model.get_rows(params_hash)

    # model.fill_select_values2(rows, fields)

    @props = {
        resource: controller_name.to_sym,
        role: current_account.highest_role,
        action: controller_name.to_sym,
        total_rows_count: model.class.count,
        data: {
            columns: cols,
            fields: fields,
            rows: rows
        },
        crud_components: CrudHelper::componentify(CrudHelper::crud_models),
        #todo get rid of this somehow
        roles: Role.all
    }

    model.class.reflect_on_all_associations(:belongs_to).each do |assoc|
      @props[assoc.plural_name] = Object.const_get(assoc.plural_name.classify).all
    end
    @props
  end

private

  def self.crud_models
    crud_models = ActiveRecord::Base.connection.tables.map do |model|
      m = model.classify.constantize rescue nil
      m.to_s.tableize if m and m.included_modules.include?(CrudModel)
    end
    crud_models.compact!
  end

  def self.componentify(models_array)
    models_array.map do |model|
      model.camelize
    end
  end

  def self.params_hash(params)
    {
        order: params[:order] || DEFAULT_SORT,
        order_by: params[:order_by] || DEFAULT_SORT_BY,
        page: params[:page] ? Integer(params[:page]) : DEFAULT_PAGE,
        page_size: params[:page_size] ? Integer(params[:page_size]) : DEFAULT_PAGE_SIZE,
        filters: params[:filters] ? JSON.parse(params[:filters]) : nil
    }
  end

  def self.finalize(object, callbacks)
    return {result: :failed, messages: object.errors.messages} unless object.valid?
    if object.save
      self::process_callbacks object, callbacks
      return {result: :ok, id: object.id}
    end
    return {result: :failed, messages: ['reason' => 'unknown']}
  end

  def self.process_callbacks(object, callbacks)
    unless callbacks.empty?
      callbacks.each do |callback|
        obj = callback[:object]
        proc = callback[:lambda]
        proc.call obj, object
      end
    end
  end

  def self.set_fields(klass, params, object)
    callbacks = []
    # iterating model fields and settting them from params
    Object.const_get(klass.to_s).new.model_fields.each do |field|
      field_value = params[field[:name].to_s]

      if [:text, :boolean, :integer, :datetime].include? field[:type]
        object.write_attribute(field[:name], field_value)
      end

      if field[:type] == :select
        related_object = Object.const_get(field[:klass].to_s).find field_value
        object.set_assoc field[:name], related_object
      end

      if field[:type] == :multiselect
        related = []
        field_value.each do |val|
          related_object = Object.const_get(field[:klass].to_s).find val
          related.push related_object
        end

        if object
          object.send(field[:name]).destroy_all
          related.each{|r| object.send(field[:name]) << r}
        else
          callback = {
              object: related,
              lambda: Proc.new do |rel, obj|
                obj.send(field[:name]).destroy_all
                rel.each do |r|
                  obj.send(field[:name]) << r
                end
                obj.save
              end
          }
          callbacks.push callback
        end
      end

      if field[:type] == :image
        image_class = field[:klass].constantize

        #todo rewrite
        if field_value
          if field_value.is_a? Hash
            image = image_class.find(field_value['id'])
          else
            image = image_class.find(field_value)
          end

          callback = {
              object: image,
              lambda: Proc.new do |img, obj|
                img.content_key = klass.to_s if img.respond_to?(:content_key)
                img.parent = obj
                img.save
              end
          }
          callbacks.push callback
          object.set_assoc field[:name], image
        end
      end
    end
    callbacks
  end
end