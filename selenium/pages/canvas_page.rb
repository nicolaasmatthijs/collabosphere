require_relative '../spec/spec_helper'

class CanvasPage

  include PageObject
  include Logging

  # Login messages
  h2(:updated_terms_heading, :xpath => '//h2[contains(text(),"Updated Terms of Use")]')
  checkbox(:terms_cbx, :name => 'user[terms_of_use]')
  button(:accept_course_invite, :name => 'accept')
  h2(:recent_activity_heading, :xpath => '//h2[contains(text(),"Recent Activity")]')

  # Course
  link(:add_new_course_button, :xpath => '//a[contains(.,"Add a New Course")]')
  text_area(:course_name_input, :xpath => '//label[@for="course_name"]/../following-sibling::td/input')
  text_area(:ref_code_input, :id => 'course_course_code')
  span(:create_course_button, :xpath => '//span[contains(.,"Add Course")]')
  button(:publish_course_button, :xpath => '//button[@class="ui-button btn-publish"]')
  button(:course_published_button, :xpath => '//button[@class="ui-button disabled btn-published"]')
  text_area(:search_course_input, :id => 'course_name')
  button(:search_course_button, :xpath => '//input[@id="course_name"]/following-sibling::button')
  li(:add_course_success, :xpath => '//li[contains(.,"successfully added!")]')

  # People
  link(:people_link, :text => 'People')
  link(:add_people_button, :id => 'addUsers')
  text_area(:user_list, :id => 'user_list_textarea')
  select_list(:user_role, :id => 'role_id')
  button(:next_button, :id => 'next-step')
  button(:add_button, :id => 'createUsersAddButton')
  paragraph(:add_users_success, :xpath => '//p[contains(.,"The following users have been enrolled")]')
  button(:done_button, :xpath => '//button[contains(.,"Done")]')

  # Tool config
  link(:apps_link, :text => 'Apps')
  link(:view_apps_link, :text => 'View App Configurations')
  link(:add_app_link, :text => 'Add App')
  button(:config_type, :xpath => '//button[@data-id="configuration_type_selector"]')
  link(:by_url, :text => 'By URL')
  text_area(:app_name_input, :xpath => '//input[@placeholder="Name"]')
  text_area(:key_input, :xpath => '//input[@placeholder="Consumer key"]')
  text_area(:secret_input, :xpath => '//input[@placeholder="Shared Secret"]')
  text_area(:url_input, :xpath => '//input[@placeholder="Config URL"]')
  link(:asset_library_app, :xpath => '//td[@title="Asset Library"]')
  link(:asset_library_link, :text => 'Asset Library')
  link(:engagement_index_app, :xpath => '//td[@title="Engagement Index"]')
  link(:engagement_index_link, :text => 'Engagement Index')

  button(:submit_button, :xpath => '//button[contains(.,"Submit")]')
  link(:logout_link, :text => 'Logout')

  def load_homepage
    logger.info 'Loading Canvas homepage'
    navigate_to "#{WebDriverUtils.base_url}"
  end

  def accept_login_messages(course_id)
    wait_until(timeout=WebDriverUtils.page_load_wait) { current_url.include? "#{course_id}" }
    if updated_terms_heading?
      logger.info 'Accepting terms and conditions'
      terms_cbx_element.when_visible timeout=WebDriverUtils.page_update_wait
      check_terms_cbx
      submit_button
    end
    recent_activity_heading_element.when_visible timeout=WebDriverUtils.page_load_wait
    if accept_course_invite?
      logger.info 'Accepting course invite'
      accept_course_invite
      accept_course_invite_element.when_not_visible timeout=WebDriverUtils.page_load_wait
    end
  end

  def load_sub_account
    navigate_to "#{WebDriverUtils.base_url}/accounts/#{WebDriverUtils.sub_account}"
  end

  def load_course_site(course_id)
    navigate_to "#{WebDriverUtils.base_url}/courses/#{course_id}"
  end

  def load_users_page(course_id)
    navigate_to "#{WebDriverUtils.base_url}/courses/#{course_id}/users"
  end

  def load_tools_config_page(course_id)
    navigate_to "#{WebDriverUtils.base_url}/courses/#{course_id}/settings/configurations"
  end

  def log_out
    WebDriverUtils.wait_for_element_and_click logout_link_element
  end

  def click_asset_library_link
    WebDriverUtils.wait_for_element_and_click asset_library_link_element
    current_url
  end

  # Clicks the Engagement Index link in the Canvas sidebar
  # TODO: @return [String]
  def click_engagement_index_link
    WebDriverUtils.wait_for_element_and_click engagement_index_link_element
    current_url
  end

  def create_course_site(test_id)
    logger.info "Creating a course site named #{test_id}"
    load_sub_account
    WebDriverUtils.wait_for_page_and_click add_new_course_button_element
    course_name_input_element.when_visible timeout=WebDriverUtils.page_update_wait
    self.course_name_input = "#{test_id}"
    self.ref_code_input = "#{test_id}"
    WebDriverUtils.wait_for_element_and_click create_course_button_element
    add_course_success_element.when_visible timeout=WebDriverUtils.page_load_wait
  end

  def publish_course(test_id)
    logger.info 'Publishing the course'
    load_sub_account
    search_course_input_element.when_visible timeout=WebDriverUtils.page_update_wait
    self.search_course_input = "#{test_id}"
    search_course_button
    WebDriverUtils.wait_for_page_and_click publish_course_button_element
    course_published_button_element.when_visible timeout=WebDriverUtils.page_load_wait
    current_url.sub("#{WebDriverUtils.base_url}/courses/", '')
  end

  def add_users(course_id, test_users, user_role)
    logger.info "Adding users with role #{user_role}"
    load_users_page course_id
    WebDriverUtils.wait_for_page_and_click add_people_button_element.when_visible
    user_list_element.when_visible timeout=WebDriverUtils.page_update_wait
    users = ''
    test_users.each do |id, user|
      if user['role'] == user_role
        users << "#{user['uid'].to_s}, "
      end
    end
    self.user_list = users
    self.user_role = user_role
    next_button
    WebDriverUtils.wait_for_page_and_click add_button_element
    add_users_success_element.when_visible timeout=WebDriverUtils.page_load_wait
    done_button
  end

  def load_add_new_tool_config(course_id)
    load_tools_config_page course_id
    WebDriverUtils.wait_for_page_and_click apps_link_element
    WebDriverUtils.wait_for_element_and_click add_app_link_element
    WebDriverUtils.wait_for_element_and_click config_type_element
    WebDriverUtils.wait_for_element_and_click by_url_element
    url_input_element.when_visible timeout=WebDriverUtils.page_update_wait
  end

  def add_asset_library(course_id)
    logger.info 'Adding asset library'
    load_add_new_tool_config course_id
    self.app_name_input = 'Asset Library'
    self.key_input = WebDriverUtils.lti_key
    self.secret_input = WebDriverUtils.lti_secret
    self.url_input = WebDriverUtils.asset_library_url
    submit_button
    asset_library_app_element.when_visible timeout=WebDriverUtils.page_load_wait
  end

  def add_engagement_index(course_id)
    logger.info 'Adding engagement index'
    load_add_new_tool_config course_id
    self.app_name_input = 'Engagement Index'
    self.key_input = WebDriverUtils.lti_key
    self.secret_input = WebDriverUtils.lti_secret
    self.url_input = WebDriverUtils.engagement_index_url
    submit_button
    engagement_index_app_element.when_visible timeout=WebDriverUtils.page_load_wait
  end

  def create_complete_test_course(test_id, test_users)
    create_course_site test_id
    course_id = publish_course test_id
    logger.info "Course ID is #{course_id}"
    add_users(course_id, test_users, 'Teacher')
    add_users(course_id, test_users, 'Designer')
    add_users(course_id, test_users, 'Student')
    add_asset_library course_id
    add_engagement_index course_id
    course_id
  end

end
