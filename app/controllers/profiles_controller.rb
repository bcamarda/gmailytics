class ProfilesController < ApplicationController
  include OauthHelper

  def new
    @profile = Profile.new
  end

  def create
    @profile = Profile.new(params[:profile])
    oauth_request_url, oauth_token, oauth_token_secret = generate_request_token()
    @profile.oauth_token = oauth_token
    @profile.oauth_token_secret = oauth_token_secret
    @profile.save
    redirect_to oauth_request_url
  end

  def show
    @profile = Profile.find_by_id(params[:id])

  end

end
