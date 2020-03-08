const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'INVITE_FRIENDS'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const inviteFriends = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    /**
     * Do test steps here
     */
    const profileAction = await selectById(client, 'id.freemo:id/action_profile')
    await profileAction.click()

    const inviteFriendsAction = await client.$('android=new UiSelector().text("Invite Friends")')
    await inviteFriendsAction.click()

    const shareBtn = await selectById(client, 'id.freemo:id/btn_share')
    await shareBtn.click()

    try {
      /**
       * Check if Share resolver is in screen
       */ 
      const shareResolver = await selectById(client, 'android:id/resolver_list')
      assert(shareResolver !== null)
      console.log(`${TEST_CASE} Success =================`)
      testSummary.addResult(TEST_CASE, true)
    } catch(ex) {
      console.log(`${TEST_CASE} Failed =================`, ex)
      testSummary.addResult(TEST_CASE, false, ex)
    }
  } catch(ex) {
    console.log(`${TEST_CASE} Failed =================`, ex)
    testSummary.addResult(TEST_CASE, false, ex)
  }
  client.deleteSession()
}

module.exports = inviteFriends