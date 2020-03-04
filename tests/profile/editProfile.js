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

const editProfile = async (
  USER_PHONE,
  { TEST_USERNAME, TEST_FULLNAME, TEST_EMAIL, TEST_ADDRESS }
) => {
  const client = await setup(USER_PHONE)

  // Clear Update Toast
  await clearUpdateToast(client)

  const profileAction = await selectById(client, 'id.freemo:id/action_profile')
  await profileAction.click()

  const editProfile = await selectById(client, 'id.freemo:id/layout_edit_profile')
  await editProfile.click()

  const usernameInput = await selectById(client, 'id.freemo:id/et_username')
  await usernameInput.addValue(TEST_USERNAME)
    
  // const mobileNumberInput = await selectById(client, 'id.freemo:id/et_mobile_number')
  // await mobileNumberInput.addValue('087887240444')

  const fullNameInput = await selectById(client, 'id.freemo:id/et_fullname')
  await fullNameInput.addValue(TEST_FULLNAME)

  // Scroll down 3 times
  await client.touchAction([
    {action: 'press', x: 703, y: 1227},
    {action: 'moveTo', x: 701, y: 564},
    'release'
  ]);
  await sleep(1000)
  await client.touchAction([
    {action: 'press', x: 696, y: 1326},
    {action: 'moveTo', x: 673, y: 576},
    'release'
  ]);
  await sleep(1000)
  await client.touchAction([
    {action: 'press', x: 654, y: 1305},
    {action: 'moveTo', x: 684, y: 583},
    'release'
  ]);
  await sleep(1000)

  // Email
  const emailInput = await selectById(client, 'id.freemo:id/et_email')
  await emailInput.addValue(TEST_EMAIL)


  // Birth Date ---------------------
  const birthDateInput = await selectById(client, 'id.freemo:id/et_birth_date')
  await birthDateInput.click()

  const yearSelect = await selectById(client, 'android:id/date_picker_header_year')
  await yearSelect.click()

  // Scroll down 3 times
  await client.touchAction([
    {action: 'press', x: 701, y: 564},
    {action: 'moveTo', x: 703, y: 1326},
    'release'
  ]);
  await sleep(1000)
  await client.touchAction([
    {action: 'press', x: 673, y: 576},
    {action: 'moveTo', x: 696, y: 1326},
    'release'
  ]);
  await sleep(1000)
  await client.touchAction([
    {action: 'press', x: 684, y: 583},
    {action: 'moveTo', x: 654, y: 1326},
    'release'
  ]);
  await sleep(1000)

  const yearTwoThousand = await client.$('android=new UiSelector().text("2000")')
  await yearTwoThousand.click()

  const fourthMarch = await client.$('~02 March 2000')
  await fourthMarch.click()

  const okBtn = await selectById(client, 'android:id/button1')
  await okBtn.click()
  // -------------------

  // Gender
  const genderSelect = await selectById(client, 'id.freemo:id/et_gender')
  await genderSelect.click()
  const maleChoice = await client.$('android=new UiSelector().text("Male")')
  await maleChoice.click()

  // Address
  const addressInput = await selectById(client, 'id.freemo:id/et_address')
  await addressInput.addValue(TEST_ADDRESS)

  // City
  const citySelect = await selectById(client, 'id.freemo:id/et_city')
  await citySelect.click()
  const jakartaChoice = await client.$('android=new UiSelector().text("Jakarta")')
  await jakartaChoice.click()

  // Hobby
  const hobbySelect = await selectById(client, 'id.freemo:id/et_hobbies')
  await hobbySelect.click()
  const sportsChoice = await client.$('android=new UiSelector().text("Sports")')
  await sportsChoice.click()
  const newsChoice = await client.$('android=new UiSelector().text("News")')
  await newsChoice.click()
  const submitBtn = await selectById(client, 'id.freemo:id/btn_submit')
  await submitBtn.click()

  // Save
  const saveBtn = await selectById(client, 'id.freemo:id/btn_save')
  await saveBtn.click()

  // Check Alert Text
  const alertTextContainer = await selectById(client, 'id.freemo:id/llAlertTextContainer')
  const alertTextEl = await selectById(alertTextContainer, 'id.freemo:id/tvText')
  const alertText = await alertTextEl.getText()

  // Check if alert not Unprocessable
  try {
    assert.notEqual(alertText, 'Unprocessable Entity')
    console.log('Edit Profile Test Success =================')
  } catch (ex) {
    console.log(ex)
    console.log('Edit Profile Test Failed ===================')
  }

  client.deleteSession()
}

module.exports = editProfile