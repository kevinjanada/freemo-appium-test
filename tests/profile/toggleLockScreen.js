const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'TOGGLE_LOCK_SCREEN'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

async function openAdAndWalletBalanceIncrease(client, ad) {

  // Get Wallet balance before open ad
  let walletBalanceBeforeOpenAd = await selectById(client, 'id.freemo:id/tv_money')
  walletBalanceBeforeOpenAd = await walletBalanceBeforeOpenAd.getText()
  walletBalanceBeforeOpenAd = walletBalanceBeforeOpenAd.match(/(\d+.?\d+)/)[0]

  await ad.click()

  // Make sure we're in ad detail activity
  const currentActivity = client.getCurrentActivity()
  assert(currentActivity, '.core.home.AdsDetailActivity')

  let openBtn
  // Open an Ad
  try {
    openBtn = await selectById(client, 'id.freemo:id/tv_see')
    const openBtnText = await openBtn.getText()

    // If no reward, return false
    if (openBtnText === 'Open') {
      // Go back to Home Page
      await client.back()

      // Wait for update toast to show, and then clear it
      await sleep(10000)
      await clearUpdateToast(client)
      return false
    }
  } catch(ex) { // If openBtn is not found, there is only share button
    // Go back to Home Page
    await client.back()

    // Wait for update toast to show, and then clear it
    await sleep(10000)
    await clearUpdateToast(client)
    return false
  }

  await openBtn.click()

  // Open Ad using chrome
  await sleep(3000)
  const intentChooser = await selectById(client, 'android:id/resolver_list')
  const layoutInner = await intentChooser.$("android.widget.LinearLayout")
  const chromeIntent = await layoutInner.$("android.widget.LinearLayout")
  await chromeIntent.click()

  // Check if chrome is opened
  const browserActivity = await client.getCurrentActivity()
  assert(browserActivity, 'com.google.android.apps.chrome.IntentDispatcher')

  // Wait for notifications to arrive
  await sleep(5000)

  // Go back to Home Page
  await client.back()
  await sleep(5000)
  await client.back()

  // Wait for update toast to show, and then clear it
  await sleep(10000)
  await clearUpdateToast(client)

  // Get wallet balance after opening ad
  let walletBalanceAfterOpenAd = await selectById(client, 'id.freemo:id/tv_money')
  walletBalanceAfterOpenAd =  await walletBalanceAfterOpenAd.getText()
  walletBalanceAfterOpenAd = walletBalanceAfterOpenAd.match(/(\d+.?\d+)/)[0]

  // Assert wallet balance increased
  const balanceBefore = parseFloat(walletBalanceBeforeOpenAd)
  const balanceAfter = parseFloat(walletBalanceAfterOpenAd)
  const isBalanceIncrease = balanceBefore < balanceAfter

  return isBalanceIncrease
}

async function openAdsUntilRewardsReceived5Times(client) {
  let rewardNum = 0;
  let scrollNum = 0;
  while(rewardNum < 5) {
    // Get ads on screen
    const ads = await client.$$('android=new UiSelector().resourceId("id.freemo:id/iv_ads")')
    for (let i = 0; i < ads.length; i++) {
      let rewardReceived = await openAdAndWalletBalanceIncrease(client, ads[i])
      if (rewardReceived) rewardNum++
      if (scrollNum > 0) {
        for (let j = 0; j < scrollNum; j++) {
          await client.touchAction([
            {action: 'press', x: 492, y: 1616},
            {action: 'moveTo', x: 495, y: 430},
            'release'
          ]);
        }
      }
    }
    // Scroll Down
    for (let j = 0; j < scrollNum; j++) {
      await client.touchAction([
        {action: 'press', x: 492, y: 1616},
        {action: 'moveTo', x: 495, y: 430},
        'release'
      ]);
    }
    scrollNum++
  }
}

const toggleLockScreen = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    await clearUpdateToast(client)

    /**
     * Do test steps here
     */

    // Open ad 5 times before lock screen can be switched
    await openAdsUntilRewardsReceived5Times(client)

    const profileAction = await selectById(client, 'id.freemo:id/action_profile')
    await profileAction.click()

    const lockScreenSwitch = await selectById(client, 'id.freemo:id/swLockscreen')
    let lockScreenStatus = await lockScreenSwitch.getText()

    try {
      /**
       * Make assertions for test results here
       */ 
      if (lockScreenStatus === 'On') {
        await lockScreenSwitch.click()
        lockScreenStatus = await lockScreenSwitch.getText()
        assert(lockScreenStatus === 'Off')
      } else {
        await lockScreenSwitch.click()
        lockScreenStatus = await lockScreenSwitch.getText()
        assert(lockScreenStatus === 'On')
      }
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

module.exports = toggleLockScreen