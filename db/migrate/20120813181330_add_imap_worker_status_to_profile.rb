class AddImapWorkerStatusToProfile < ActiveRecord::Migration
  def change
  	add_column :profiles, :imap_worker_started_at, :timestamp
  	add_column :profiles, :imap_worker_completed_at, :timestamp
  end
end
