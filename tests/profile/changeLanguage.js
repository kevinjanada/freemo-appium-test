/**
 * Test ini Fail karena ketika change language, aplikasi ke exit
 */

const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'change_language'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const changeLanguage = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    const profileAction = await selectById(client, 'id.freemo:id/action_profile')
    await profileAction.click()
    
    const languageSelect = await selectById(client, 'id.freemo:id/tv_language_value')
    await languageSelect.click()

    const englishChoice = await client.$('android=new UiSelector().text("English")')
    await englishChoice.click()

    const languageSelectText = await languageSelect.getText()
    
    try {
      assert.equal(languageSelectText, "English")
      console.log('Change Language Test Success ================')
      testSummary.addResult(TEST_CASE, true)
    } catch(ex) {
      console.log(ex)
      console.log('Change Language Test Failed ================')
      testSummary.addResult(TEST_CASE, false, ex)
    }
    client.deleteSession()
  } catch(ex) {
    testSummary.addResult(TEST_CASE, false, ex)
    client.deleteSession()
  }
}

module.exports = changeLanguage
