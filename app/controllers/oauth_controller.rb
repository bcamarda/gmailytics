class OauthController < ApplicationController
  include OauthHelper
  
  def create
        oauth_token = params[:oauth_token]
        oauth_verifier = params[:oauth_verifier]
        
        @profile = Profile.find_by_oauth_token(oauth_token)

        puts '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
              puts "OAUTH TOKEN #{oauth_token}"
              puts "OAUTH SECRET #{@profile.oauth_token_secret}"
        puts '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
        if !@profile
          raise @profile.inspect
            # Do something appropriate, such as a 404
        else
          begin
            oauth_tokens = get_access_token(oauth_token, @profile.oauth_token_secret, oauth_verifier)
              # Update @user, save oauth_tokens in the database (in a secure way)
              puts '------------------------------------------------------------'
              puts oauth_tokens.inspect
              puts '------------------------------------------------------------'

              @profile.update_attributes oauth_tokens
              @profile.fetch_and_save_emails
          rescue Exception => e
              # Something went wrong, or user did not give you permissions on Gmail
              # Do something appropriate, potentially try again?
            flash[:error] = "There was an error while authenticating with Gmail. Please try again."
            warn flash[:error]
          end          
          redirect_to profile_path(@profile)
        end
    end
end