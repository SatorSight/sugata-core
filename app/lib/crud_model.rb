module CrudModel

  IMAGE_NAMES = [:image, :logo, :additional_image]

  def name
    read_attribute(:name)
  end

  def set_assoc(name, value)
    association(name).writer(value)
  end

  def to_s
    self.name
  end

  def get_fields
    self.class.columns.map{|col| col.name unless assoc_attributes.include? col.name}.compact
  end

  def assoc_attributes
    self.class.reflect_on_all_associations.map{|x| x.class_name.underscore << '_id'}.compact
  end

  def cols
    fields = get_fields
    react_fields = fields.each_with_index.map do |field, i|
      {
          id: field.to_sym,
          numeric: self.class.type_for_attribute(field).type == :integer,
          # disablePadding: i == 0,
          disablePadding: true,
          label: field.capitalize.to_sym,
          type: self.class.columns_hash[field].type
      }
    end

    (self.class.reflect_on_all_associations(:belongs_to)+self.class.reflect_on_all_associations(:has_one))
        .each do |assoc|
      field = {
          id: assoc.name,
          numeric: false,
          disablePadding: false,
          label: assoc.name.to_s.capitalize.to_sym,
          type: nil
      }
      react_fields.push field
    end
    react_fields
  end

  def prepared_model(model, params_hash, assoc)
    order_by = params_hash[:order_by]
    order_by << '_id' if assoc.include? order_by.to_sym

    if params_hash[:filters]
      params_hash[:filters].each do |key, filter|
        if assoc.include?(key.to_sym)
          model = model.where((key + '_id').to_sym => filter)
        else

          filter_type = model.columns_hash[key.to_s].type

          if filter_type == :integer
            model = model.where(key.to_sym => filter)
          end

          if filter_type == :string
            model = model.where("#{key} ILIKE '%#{filter}%'")
          end

          if filter_type == :datetime
            from = filter['from']
            to = filter['to']

            from = Date.parse(from) unless from.blank?
            to = Date.parse(to) unless to.blank?

            if from.present? and to.present?
              model = model.where("#{key} >= ? and #{key} <= ?", from, to)
            else
              if from.present?
                model = model.where("#{key} >= ?", from)
              end
              if to.present?
                model = model.where("#{key} <= ?", to)
              end
            end

          end

        end
      end
    end

    model
        .order(order_by => params_hash[:order])
        .limit(params_hash[:page_size])
        .offset(params_hash[:page] * params_hash[:page_size])
  end

  def get_rows(params_hash)
    model = self.class
    belongs_to_associations = model.reflect_on_all_associations(:belongs_to).map{|x| x.class_name.underscore}.compact
    has_one_associations = model.reflect_on_all_associations(:has_one).map{|x| x.class_name.underscore}.compact
    has_and_belongs_to_many_assoc = model.reflect_on_all_associations(:has_and_belongs_to_many).map{|x| x.class_name.underscore.tableize}.compact

    include_array = []
    (has_one_associations + belongs_to_associations + has_and_belongs_to_many_assoc).each{|a| include_array.push a.to_sym}

    rows = prepared_model(model, params_hash, include_array).includes(include_array).map do |item|
      row = {}
      get_fields.each{|f| row[f] = item.send f}
      belongs_to_associations.each{|a| row[a] = item.send(a).to_s.blank? ? nil : item.send(a).to_s}
      has_one_associations.each{|a| row[a] = item.send(a).to_s}
      has_and_belongs_to_many_assoc.each{|a| row[a] = item.send(a)}
      row['fields'] = model.new.model_fields(item)

      row
    end

    # rows
    fill_select_values rows
  end

  def fill_select_values(rows)
    selects = collect_select_fields(rows)
    selects_hash = {}
    selects.each do |s|
      selects_hash[s] = s.to_s.classify.constantize.all
    end

    new_rows = []
    rows.each do |row|
      fields = row['fields']
      fields.each do |field|
        if field[:type] == :select
          field[:values] = selects_hash[field[:name]]
        end
      end
      new_rows.push row
    end

    # new_rows.compact!
    new_rows
  end

  def collect_select_fields(rows)
    fields_array = []

    rows.each do |row|
      fields = row['fields']
      fields.each do |field|
        if field[:type] == :select
          fields_array.push field[:name] unless fields_array.include? field[:name]
        end
      end
    end

    fields_array
  end

  def model_fields(item = nil)
    fields = get_fields
    react_fields = fields.reject{|e| e == 'id' || e == 'created_at' || e == 'updated_at'}.map do |field|
      type = :text
      unless [:text, :string].include? self.class.columns_hash[field].type
        type = self.class.columns_hash[field].type
      end
      {
          id: item ? item.id : nil,
          field_id: field.to_sym,
          label: field.capitalize.to_sym,
          value: item ? item.send(field) : '',
          name: field.to_sym,
          type: type,
          required: false
      }
    end

    belongs_to_assoc = self.class.reflect_on_all_associations(:belongs_to)
    has_one_assoc = self.class.reflect_on_all_associations(:has_one)
    has_and_belongs_to_many_assoc = self.class.reflect_on_all_associations(:has_and_belongs_to_many)
    all_assoc = belongs_to_assoc + has_one_assoc + has_and_belongs_to_many_assoc

    all_assoc.each do |assoc|
      name = assoc.name
      assoc_class = name.to_s.classify.constantize
      type = :select
      type = :image if IMAGE_NAMES.include?(name.to_sym)
      type = :multiselect if assoc.is_a? ActiveRecord::Reflection::HasAndBelongsToManyReflection

      if item
        id = item.id
      else
        if type == :select
          if assoc_class.any?
            id = assoc_class.first.id
          else
            id = nil
          end
        else
          id = nil
        end
      end

      if item
        if IMAGE_NAMES.include?(type) == :image
          value = item.send(name.to_sym) ? item.send(name.to_sym).id : nil
        else
          value = item.send(name.to_sym)
        end
      else
        if type == :multiselect
          value = item ? item.send(name.to_sym).map{|rel| rel.id}.compact : []
        else
          value = assoc_class.first
        end
      end

      values = nil
      unless IMAGE_NAMES.include?(type)
        # unless type == :select
          values = assoc_class.all
        # end
      end

      if type == :select
        if assoc_class.has_attribute? 'name'
          values = values.sort_by{|f| f[:name]}
        end
      end

      field = {
          id: id,
          field_id: :name,
          label: name.capitalize.to_sym,
          value: value,
          name: name.to_sym,
          type: type,
          klass: assoc_class.to_s,
          # values: IMAGE_NAMES.include?(type) ? nil : assoc_class.all,
          values: values,
          required: true,
          field_type: :assoc
      }
      react_fields.push field
    end
    react_fields
  end
end