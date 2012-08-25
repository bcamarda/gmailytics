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
    @profile = Profile.find_by_slug(params[:id])

    if @profile.nil? || @profile.deleted?
      flash[:error] = "Profile not found"
      redirect_to root_path
    else
      respond_to do |format|
        format.json { render :json => @profile.get_graph_data(params[:last_email_id]) }
        format.html
      end
    end
  end

  def destroy
    @profile = Profile.find_by_slug(params[:id])
    @profile.marked_as_deleted = true
    if @profile.save
      flash[:success] = "Profile deleted"
      redirect_to root_path
    else
      flash[:error] = "There was an error deleting your profile. Please try again."
      redirect_to :back
    end
  end

end
