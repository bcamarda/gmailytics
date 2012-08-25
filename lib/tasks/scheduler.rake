desc "This task is called by the Heroku scheduler add-on"
task :delete_marked_and_old_unused_profiles => :environment do
    puts "checking and deleting profiles"
    Profile.delete_marked_and_old_unused_profiles
    puts "done."
end