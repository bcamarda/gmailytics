require 'spec_helper'

describe 'Request your email to be profiled'  do
	it 'queues up a email profiling task and informs the user when he asks to have his email profiled' do
		visit root_path
		fill_in 'email', :with => 'throwaway@perspectivezoom.com'
		fill_in 'password', :with => 'mvclover'
		click_button ("Profile my emails!")
		page.should have_content('Analysis Complete')

	end
end