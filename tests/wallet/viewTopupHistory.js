const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'VIEW_TOPUP_HISTORY'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const viewTopupHistory = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    /**
     * Do test steps here
     */
    const walletAction = await selectById(client, 'id.freemo:id/ic_wallet')
    await walletAction.click()

    const topupBtn = await client.$('android=new UiSelector().className("android.widget.TextView").text("Top-up")')
    await topupBtn.click()

    try {
      /**
       * Make assertions for test results here
       */
      const topupRecyclerView = await selectById(client, 'id.freemo:id/rv_topup')
      assert(topupRecyclerView !== null)
      const topupHistoryAmounts = await client.$$('android=new UiSelector().resourceId("id.freemo:id/tv_nominal")')
      assert(topupHistoryAmounts.length > 0)
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

module.exports = viewTopupHistory