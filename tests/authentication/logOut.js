const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'LOG_OUT'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const logOut = async(USER_PHONE) => {
  const client = await setup(USER_PHONE)

  try {
    await clearUpdateToast(client)

    const profileAction = await selectById(client, 'id.freemo:id/action_profile')
    await profileAction.click()

    const logOutBtn = await client.$('android=new UiSelector().text("Log Out")')
    await logOutBtn.click()

    const okBtn = await client.$('android=new UiSelector().text("OK")')
    await okBtn.click()

    const currentActivity = await client.getCurrentActivity()

    try {
      assert.equal(currentActivity, '.core.login.LoginActivity')
      console.log('Log Out Test Success ====================')
      testSummary.addResult(TEST_CASE, true)
    } catch(ex) {
      console.log('Log Out Test Failed =====================', ex)
      testSummary.addResult(TEST_CASE, false, ex)
    }

  } catch(ex) {
    console.log('Log Out Test Failed =====================', ex)
    testSummary.addResult(TEST_CASE, false, ex)
  }
  client.deleteSession()
}

module.exports = logOut