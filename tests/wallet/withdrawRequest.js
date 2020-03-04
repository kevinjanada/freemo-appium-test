/**
 * Withdraw Request
 * 
 * Test ini memerlukan minimal Rp.50,000 pada  wallet user
 */

const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const withdrawRequest = async (USER_PHONE, TEST_ACCOUNT_NAME, TEST_ACCOUNT_NUMBER) => {
  const client = await setup(USER_PHONE)

  // Clear Update Toast
  await clearUpdateToast(client)

  sleep(1000)

  const walletAction = await selectById(client, 'id.freemo:id/ic_wallet')
  await walletAction.click()

  const withdrawAction = await client.$('android=new UiSelector().text("Withdraw")')
  await withdrawAction.click()

  const withdrawBtn = await client.$('android=new UiSelector().text("WITHDRAW")')
  await withdrawBtn.click()

  const withdrawNominalInput = await selectById(client, 'id.freemo:id/et_nominal')
  await withdrawNominalInput.addValue('50000') // Withdraw request minimum is 50,000

  const bankSelect = await selectById(client, 'id.freemo:id/et_bank')
  await bankSelect.click()

  const bcaChoice = await client.$('android=new UiSelector().text("Bank Bca")')
  await bcaChoice.click()

  // Scroll Down
  await client.touchAction([
    {action: 'press', x: 492, y: 1219},
    {action: 'moveTo', x: 468, y: 465},
    'release'
  ]);

  const accountNameInput = await selectById(client, 'id.freemo:id/et_account_name')
  await accountNameInput.addValue(TEST_ACCOUNT_NAME)

  const accountNumberInput = await selectById(client, 'id.freemo:id/et_account_number')
  await accountNumberInput.addValue(TEST_ACCOUNT_NUMBER)

  const submitBtn = await selectById(client, 'id.freemo:id/btn_submit')
  await submitBtn.click()

  const successMessage = await selectById(client, 'android:id/message')
  const successMessageText = await successMessage.getText()

  try {
    assert.equal(successMessageText, 'Success')
  } catch(ex) {
    console.log(ex)
  }

  const okBtn = await selectById(client, 'android:id/button1')
  await okBtn.click()

  sleep(1000)

  await withdrawAction.click()

  try {
    const latestWithdrawRequest = await client.$(`android=new UiSelector().text("Bank Bca ${TEST_ACCOUNT_NUMBER} ${TEST_ACCOUNT_NAME}")`)
    assert(latestWithdrawRequest != null)
    console.log("Withdraw Request Test Success =======================")
  } catch(ex) {
    console.log("Withdraw Request Test Failed ========================")
    console.log("=============================")
    console.log(ex)
  }

  client.deleteSession()
}

module.exports = withdrawRequest