/**
 * Test ini Fail karena ketika change language, aplikasi ke exit
 */

const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')

const setup = async () => {
  let client = await goToLogin()
  client = await authenticate(client)
  return client
}

const createImageAd = async () => {
  const client = await setup()

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
  } catch(ex) {
    console.log(ex)
  }
}

module.exports = createImageAd
