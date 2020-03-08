const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'VIEW_VIDEO_ADS'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const viewVideoAds = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    /**
     * Do test steps here
     */
    // Go to Video Fragment
    const videoAction = await selectById(client, 'id.freemo:id/action_video')
    await videoAction.click()


    try {
      /**
       * Check if video ads RecyclerView exists
       */ 
      const videoAdsRecyclerView = await selectById(client, 'id.freemo:id/rv_client_ads')
      assert(videoAdsRecyclerView !== null)
    } catch(ex) {
      console.log(`${TEST_CASE} Failed =================`, ex)
      testSummary.addResult(TEST_CASE, false, ex)
    }

    try {
      /**
       * Check if video Ads element is more than 0
       */ 
      const videoAds = await client.$$('android=new UiSelector().resourceId("id.freemo:id/iv_image_thumbnail")')
      assert(videoAds.length > 0)
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

module.exports = viewVideoAds