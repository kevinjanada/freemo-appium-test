const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'topup_request'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const topupRequest = async (USER_PHONE, TOPUP_TYPE, TEST_ACCOUNT_NAME, TEST_ACCOUNT_NUMBER) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    sleep(1000)

    const walletAction = await selectById(client, 'id.freemo:id/ic_wallet')
    await walletAction.click()

    const topupAction = await client.$('android=new UiSelector().text("Top-up")')
    await topupAction.click()

    const topupBtn = await client.$('android=new UiSelector().text("TOP-UP")')
    await topupBtn.click()

    sleep(1000)

    const chooseBtn = await client.$(`android=new UiSelector().resourceId("id.freemo:id/btn_choose").instance(${TOPUP_TYPE.index})`)
    await chooseBtn.click()

    const yesBtn = await selectById(client, 'android:id/button1')
    await yesBtn.click()

    sleep(1000)

    const topupStatus = await selectById(client, 'id.freemo:id/tv_status_value')
    const topupStatusText = await topupStatus.getText()

    const topupType = await selectById(client, 'id.freemo:id/tv_top_up_type_value')
    const topupTypeText = await topupType.getText()

    const topupPrice = await selectById(client, 'id.freemo:id/tv_price_value')
    const topupPriceText = await topupPrice.getText()

    // Will be used for assertion later in the test
    const topupInvoice = await selectById(client, 'id.freemo:id/tv_invoice_no_value')
    const topupInvoiceText = await topupInvoice.getText()

    try {
      assert.equal(topupStatusText, 'incomplete')
      assert.equal(topupTypeText, TOPUP_TYPE.text)
      assert.equal(topupPriceText, TOPUP_TYPE.price)
    } catch(ex) {
      console.log(ex)
    }

    // Scroll down
    await client.touchAction([
      {action: 'press', x: 507, y: 1204},
      {action: 'moveTo', x: 511, y: 639},
      'release'
    ]);

    let submitBtn = await selectById(client, 'id.freemo:id/btn_submit')
    await submitBtn.click()

    const bankSelect = await selectById(client, 'id.freemo:id/et_bank')
    await bankSelect.click()

    const bcaChoice = await client.$('android=new UiSelector().text("Bank Bca")')
    await bcaChoice.click()

    const accountNameInput = await selectById(client, 'id.freemo:id/et_account_name')
    await accountNameInput.addValue(TEST_ACCOUNT_NAME)

    const accountNumberInput = await selectById(client, 'id.freemo:id/et_account_number')
    await accountNumberInput.addValue(TEST_ACCOUNT_NUMBER)

    // Scroll Down
    await client.touchAction([
      {action: 'press', x: 511, y: 1425},
      {action: 'moveTo', x: 507, y: 681},
      'release'
    ]);

    // Upload Proof of Payment
    const photoInput = await selectById(client, 'id.freemo:id/iv_photo_thumbnail')
    await photoInput.click()

    const galleryChoice = await client.$('android=new UiSelector().text("Open Gallery")')
    await galleryChoice.click()

    try {
      /**
       * Try to select using Photos app
       */
      const selectPhotos = await client.$('android=new UiSelector().text("Photos")')
      await selectPhotos.click()
    } catch(ex) {
      /**
       * Fallback
       * If prompt asks for Complete action using Photos,
       * click on JUST ONCE
       */
      const buttonOnce = await client.$('android=new UiSelector().text("JUST ONCE")')
      await buttonOnce.click()
    }

    sleep(1000)

    /**
     * Select Image
     */
    let image = await client.$(`android=new UiSelector().text("Image")`)
    await image.click()
    await sleep(3000)
    /**
     * Select the first image
     */
    let imagesRecyclerView = await selectById(client, 'com.google.android.apps.photos:id/recycler_view')
    image = await imagesRecyclerView.$(`android=new UiSelector().className("android.view.ViewGroup").instance(1)`)
    await image.click()

    submitBtn = await selectById(client, 'id.freemo:id/btn_submit')
    await submitBtn.click()

    try {
      const message = await selectById(client, 'android:id/message')
      const messageValue = await message.getText()
      assert.equal(messageValue, 'Success')
    } catch (ex) {
      console.log(ex)
    }

    const okBtn = await selectById(client, 'android:id/button1')
    await okBtn.click()

    /**
     * Check if top up request is pending
     */
    await topupAction.click()
    const topupList = await selectById(client, 'id.freemo:id/rv_topup')
    // Select the top top up item
    const lastTopup = await topupList.$('android=new UiSelector().className("android.widget.LinearLayout").instance(0)')
    const lastTopupValue = await selectById(lastTopup, 'id.freemo:id/tv_nominal')
    const lastTopupValueText = await lastTopupValue.getText()
    const lastTopupInvoice = await selectById(lastTopup, 'id.freemo:id/tv_invoice')
    const lastTopupInvoiceText = await lastTopupInvoice.getText()
    const lastTopupStatus = await selectById(lastTopup, 'id.freemo:id/tv_status')
    const lastTopupStatusText = await lastTopupStatus.getText()

    try {
      assert.equal(lastTopupValueText, TOPUP_TYPE.price)
      assert.equal(lastTopupInvoiceText, topupInvoiceText)
      assert.equal(lastTopupStatusText, 'PENDING')
      console.log("Topup Request Test Success ====================")
      testSummary.addResult(TEST_CASE, true)
    } catch (ex) {
      console.log("Topup Request Test Failed =====================")
      console.log("=============================")
      console.log(ex)
      testSummary.addResult(TEST_CASE, false)
    }
    client.deleteSession()
  } catch(ex) {
    testSummary.addResult(TEST_CASE, false, ex)
    client.deleteSession()
  }
}

module.exports = topupRequest