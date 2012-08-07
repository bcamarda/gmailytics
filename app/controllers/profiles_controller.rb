class ProfilesController < ApplicationController

  def new
    @profile = Profile.new
  end

  def create
    @profile = Profile.new(params[:profile])
    @profile.save
    redirect_to profile_path(@profile)
  end

  def show
    @profile = Profile.find_by_id(params[:id])
    @emails = @profile.fetch_emails
  end

end
