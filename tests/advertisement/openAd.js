/**
 * Test Open Ad
 * - Ketika User mengklik tombl open pada ad detail,
 * - User akan mendapat reward dan wallet balance bertambah.
 * 
 * Note:
 * Tes ini akan mengklik ad pertama yang ada di list.
 * Jika ad tersebut sudah dibuka sebelumnya dalam waktu 1 jam, maka user tidak akan mendapat reward.
 * 
 * Untuk keperluan testing, waktu ad dibuka dapat diubah pada database.
 * Table: expense
 * select row where
 * user_id = id user yg membuka ad AND
 * from_id = id advertisement
 * 
 * lalu ubah kolom created_ad menjadi 1 jam sebelumnya
 */
const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const TEST_CASE = 'open_ad'

const openAd = async(USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {
    // Clear Update Toast
    await clearUpdateToast(client)

    // Get Wallet balance before open ad
    let walletBalanceBeforeOpenAd = await selectById(client, 'id.freemo:id/tv_money')
    walletBalanceBeforeOpenAd = await walletBalanceBeforeOpenAd.getText()
    walletBalanceBeforeOpenAd = walletBalanceBeforeOpenAd.match(/(\d+.?\d+)/)[0]

    // Select an Advertisement
    const adRecyclerView = await selectById(client, 'id.freemo:id/rv_client_ads')
    const adCard = await adRecyclerView.$("android.widget.LinearLayout")
    await adCard.click()

    // Make sure we're in ad detail activity
    const currentActivity = client.getCurrentActivity()
    assert(currentActivity, '.core.home.AdsDetailActivity')

    // Open an Ad
    const openBtn = await selectById(client, 'id.freemo:id/layout_see')
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
    try {
      assert.equal(isBalanceIncrease, true)
      console.log('Open Image Ad Test Success =====')
      testSummary.addResult('open_image_ad', true)
    } catch (ex) {
      console.log('Test Failed ====== Balance did not increase')
      console.log('Has the ad been opened in the last 1 hour?')
      console.log(ex)
      testSummary.addResult('open_image_ad', false)
    }
    client.deleteSession()
  } catch (ex) {
    testSummary.addResult(TEST_CASE, false, ex)
    client.deleteSession()
  }

}

module.exports = openAd