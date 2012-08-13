# encoding: UTF-8
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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120813181330) do

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "emails", :force => true do |t|
    t.integer  "profile_id"
    t.string   "subject"
    t.datetime "date"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "sentreceived"
    t.string   "seenunseen"
    t.string   "uid"
    t.string   "from_address"
  end

  add_index "emails", ["date"], :name => "index_emails_on_date"
  add_index "emails", ["from_address"], :name => "index_emails_on_from_address"
  add_index "emails", ["uid"], :name => "index_emails_on_uid"

  create_table "emails_tos", :force => true do |t|
    t.integer  "email_id"
    t.string   "recipient_type"
    t.string   "address"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "emails_tos", ["address"], :name => "index_emails_tos_on_address"

  create_table "profiles", :force => true do |t|
    t.string   "email"
    t.string   "oauth_token"
    t.string   "oauth_token_secret"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
    t.datetime "imap_worker_started_at"
    t.datetime "imap_worker_completed_at"
  end

end
