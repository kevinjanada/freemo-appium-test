const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'VIEW_WITHDRAW_HISTORY'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const viewWithdrawHistory = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    /**
     * Do test steps here
     */
    const walletAction = await selectById(client, 'id.freemo:id/ic_wallet')
    await walletAction.click()

    const withdrawBtn = await client.$('android=new UiSelector().className("android.widget.TextView").text("Withdraw")')
    await withdrawBtn.click()

    try {
      /**
       * Make assertions for test results here
       */ 
      const withdrawRecyclerView = await selectById(client, 'id.freemo:id/rv_withdraw')
      assert(withdrawRecyclerView !== null)
      const withdrawHistoryAmounts = await client.$$('android=new UiSelector().resourceId("id.freemo:id/tv_nominal")')
      assert(withdrawHistoryAmounts.length > 0)
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

module.exports = viewWithdrawHistory