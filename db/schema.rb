# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180604110535) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "login"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "realm_id"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.index ["realm_id"], name: "index_accounts_on_realm_id"
    t.index ["reset_password_token"], name: "index_accounts_on_reset_password_token", unique: true
  end

  create_table "accounts_roles", id: false, force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "role_id", null: false
    t.index ["account_id", "role_id"], name: "index_accounts_roles_on_account_id_and_role_id"
    t.index ["role_id", "account_id"], name: "index_accounts_roles_on_role_id_and_account_id"
  end

  create_table "additional_images", force: :cascade do |t|
    t.string "path"
    t.integer "parent_id"
    t.string "parent_type"
    t.string "extension"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.text "html"
    t.integer "page_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "issue_id"
    t.text "desktop_html"
    t.string "desktop_bg"
    t.boolean "active", default: true
    t.boolean "chosen"
    t.boolean "linked"
    t.boolean "cover"
    t.boolean "show_in_lists"
    t.index ["issue_id"], name: "index_articles_on_issue_id"
  end

  create_table "articles_tags", id: false, force: :cascade do |t|
    t.bigint "article_id", null: false
    t.bigint "tag_id", null: false
    t.index ["article_id", "tag_id"], name: "index_articles_tags_on_article_id_and_tag_id"
    t.index ["tag_id", "article_id"], name: "index_articles_tags_on_tag_id_and_article_id"
  end

  create_table "big_preview_images", force: :cascade do |t|
    t.string "path"
    t.integer "parent_id"
    t.string "parent_type"
    t.string "extension"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "bundle_accesses", force: :cascade do |t|
    t.string "name"
    t.string "redirect_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "operator_id"
    t.string "service_id"
    t.index ["operator_id"], name: "index_bundle_accesses_on_operator_id"
  end

  create_table "bundle_accesses_bundles", id: false, force: :cascade do |t|
    t.bigint "bundle_access_id", null: false
    t.bigint "bundle_id", null: false
    t.index ["bundle_access_id", "bundle_id"], name: "index_bundle_accesses_bundles_on_bundle_access_id_and_bundle_id"
    t.index ["bundle_id", "bundle_access_id"], name: "index_bundle_accesses_bundles_on_bundle_id_and_bundle_access_id"
  end

  create_table "bundles", force: :cascade do |t|
    t.string "name"
    t.bigint "realm_id"
    t.bigint "image_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "service_id"
    t.string "mobile_redirect_url"
    t.string "card_redirect_url"
    t.integer "order"
    t.index ["image_id"], name: "index_bundles_on_image_id"
    t.index ["realm_id"], name: "index_bundles_on_realm_id"
  end

  create_table "bundles_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "bundle_id", null: false
    t.index ["bundle_id", "user_id"], name: "index_bundles_users_on_bundle_id_and_user_id"
    t.index ["user_id", "bundle_id"], name: "index_bundles_users_on_user_id_and_bundle_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.bigint "article_id"
    t.index ["article_id"], name: "index_comments_on_article_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "images", force: :cascade do |t|
    t.string "extension"
    t.string "content_key"
    t.string "path"
    t.integer "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "parent_type"
    t.integer "page_number"
  end

  create_table "issues", force: :cascade do |t|
    t.integer "number"
    t.integer "listing_page"
    t.boolean "double_month"
    t.boolean "double_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "journal_id"
    t.bigint "image_id"
    t.datetime "content_date"
    t.index ["image_id"], name: "index_issues_on_image_id"
    t.index ["journal_id"], name: "index_issues_on_journal_id"
  end

  create_table "journals", force: :cascade do |t|
    t.string "name"
    t.string "url_prefix"
    t.integer "order"
    t.boolean "archived"
    t.text "description"
    t.bigint "bundle_id"
    t.bigint "period_id"
    t.bigint "image_id"
    t.bigint "logo_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.bigint "additional_image_id"
    t.index ["additional_image_id"], name: "index_journals_on_additional_image_id"
    t.index ["bundle_id"], name: "index_journals_on_bundle_id"
    t.index ["image_id"], name: "index_journals_on_image_id"
    t.index ["logo_id"], name: "index_journals_on_logo_id"
    t.index ["period_id"], name: "index_journals_on_period_id"
  end

  create_table "likes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.bigint "article_id"
    t.index ["article_id"], name: "index_likes_on_article_id"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "listings", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "issue_id"
    t.index ["issue_id"], name: "index_listings_on_issue_id"
  end

  create_table "logos", force: :cascade do |t|
    t.string "path"
    t.integer "parent_id"
    t.string "parent_type"
    t.string "extension"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "operators", force: :cascade do |t|
    t.string "name"
    t.string "tech_name"
    t.bigint "realm_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.bigint "realm_payment_type_id"
    t.index ["realm_id"], name: "index_operators_on_realm_id"
    t.index ["realm_payment_type_id"], name: "index_operators_on_realm_payment_type_id"
  end

  create_table "periods", force: :cascade do |t|
    t.string "name"
    t.string "key"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "realm_auth_types", force: :cascade do |t|
    t.bigint "realm_id"
    t.index ["realm_id"], name: "index_realm_auth_types_on_realm_id"
  end

  create_table "realm_locales", force: :cascade do |t|
    t.string "locale_file_path"
    t.bigint "realm_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["realm_id"], name: "index_realm_locales_on_realm_id"
  end

  create_table "realm_payment_types", force: :cascade do |t|
    t.bigint "realm_id"
    t.string "name"
    t.string "redirect_url"
    t.index ["realm_id"], name: "index_realm_payment_types_on_realm_id"
  end

  create_table "realm_settings", force: :cascade do |t|
    t.string "setting"
    t.bigint "realm_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "value"
    t.index ["realm_id"], name: "index_realm_settings_on_realm_id"
  end

  create_table "realms", force: :cascade do |t|
    t.string "secret_key"
    t.string "name"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "key"
  end

  create_table "slave_sync_requests", force: :cascade do |t|
    t.integer "realm_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "small_preview_images", force: :cascade do |t|
    t.string "path"
    t.integer "parent_id"
    t.string "parent_type"
    t.string "extension"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.string "key"
    t.boolean "is_hub"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "image_id"
    t.index ["image_id"], name: "index_tags_on_image_id"
  end

  create_table "user_bundle_references", force: :cascade do |t|
  end

  create_table "user_data", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["user_id"], name: "index_user_data_on_user_id"
  end

  create_table "user_histories", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["user_id"], name: "index_user_histories_on_user_id"
  end

  create_table "user_tag_preferences", force: :cascade do |t|
    t.integer "value"
    t.bigint "user_id"
    t.bigint "tag_id"
    t.index ["tag_id"], name: "index_user_tag_preferences_on_tag_id"
    t.index ["user_id"], name: "index_user_tag_preferences_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "msisdn"
    t.string "email"
    t.string "login"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "operator_id"
    t.bigint "bundle_id"
    t.index ["bundle_id"], name: "index_users_on_bundle_id"
    t.index ["operator_id"], name: "index_users_on_operator_id"
  end

  add_foreign_key "accounts", "realms"
  add_foreign_key "articles", "issues"
  add_foreign_key "bundles", "realms"
  add_foreign_key "comments", "articles"
  add_foreign_key "comments", "users"
  add_foreign_key "issues", "images"
  add_foreign_key "issues", "journals"
  add_foreign_key "journals", "bundles"
  add_foreign_key "journals", "periods"
  add_foreign_key "likes", "articles"
  add_foreign_key "likes", "users"
  add_foreign_key "listings", "issues"
  add_foreign_key "realm_auth_types", "realms"
  add_foreign_key "realm_locales", "realms"
  add_foreign_key "realm_payment_types", "realms"
  add_foreign_key "realm_settings", "realms"
  add_foreign_key "tags", "images"
  add_foreign_key "user_histories", "users"
  add_foreign_key "user_tag_preferences", "tags"
  add_foreign_key "user_tag_preferences", "users"
  add_foreign_key "users", "operators"
end
