require_relative '../spec/spec_helper'

class EngagementIndexPage

  include PageObject
  include Logging

  text_area(:search_input, :class => 'leaderboard-list-search')
  link(:download_csv_link, :text => 'Download CSV')
  table(:users_table, :class => 'leaderboard-list-table')

  # TODO: apply the same to asset library load-page method
  def load_page(driver, url)
    navigate_to url
    wait_until(timeout=WebDriverUtils.page_load_wait) { self.title == 'Engagement Index' }
    wait_until(timeout) { driver.find_element(:id, 'tool_content') }
    driver.switch_to.frame driver.find_element(:id, 'tool_content')
  end

  # Searches for a user by name and waits until the user's name appears in the first row
  # @param user [Hash]
  def search_for_user(user)
    name = user['fullName']
    WebDriverUtils.wait_for_page_and_click search_input_element
    self.search_input = name
    wait_until(timeout=WebDriverUtils.page_update_wait) { (users_table_element[1][1].text).include? name }
  end

  # Downloads the csv, returns an array of , and then deletes the file
  # @param driver [Selenium::WebDriver]
  # @param url [String]
  # @return [Array]
  def download_csv(driver, url)
    WebDriverUtils.make_download_dir
    load_page(driver, url)
    WebDriverUtils.wait_for_page_and_click download_csv_link_element
    file = File.join("#{WebDriverUtils.download_dir}/activities.csv")
    wait_until(timeout=WebDriverUtils.page_load_wait) { File.file? file }
    activities = []
    CSV.foreach("#{WebDriverUtils.download_dir}/activities.csv") do |column|
      # user_name, action, score, total
      activities << "#{column[1]}, #{column[2]}, #{column[4]}, #{column[5]}"
    end
    activities
  ensure
    File.delete file
  end

end
