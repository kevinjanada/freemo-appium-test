const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'VIEW_PROFILE'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const viewProfile = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    /**
     * Do test steps here
     */
    const profileAction = await selectById(client, 'id.freemo:id/action_profile')
    await profileAction.click()


    try {
      /**
       * Make assertions for test results here
       */ 
      const fullName = await selectById(client, 'id.freemo:id/tv_full_name')
      const membershipLevel = await selectById(client, 'id.freemo:id/tv_membership')
      const registeredDate = await selectById(client, 'id.freemo:id/tv_registered_date')
      assert(fullName !== null)
      assert(membershipLevel !== null)
      assert(registeredDate !== null)
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

module.exports = viewProfile