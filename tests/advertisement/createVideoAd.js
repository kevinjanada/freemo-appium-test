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

const createVideoAd = async (
  USER_PHONE,
  {TEST_TITLE, TEST_DESCRIPTION, TEST_VID_URL}
) => {
  const client = await setup(USER_PHONE)

  // Clear Update Toast
  await clearUpdateToast(client)

  const profileAction = await selectById(client, 'id.freemo:id/action_profile')
  await profileAction.click()

  const myAdsLayout = await selectById(client, 'id.freemo:id/layout_myads')
  await myAdsLayout.click()

  const addFab = await selectById(client, 'id.freemo:id/fab_add')
  await addFab.click()

  const addVideoAdLayout = await selectById(client, 'id.freemo:id/layout_video_ads')
  await addVideoAdLayout.click()

  /**
   * Step 1
   */
  const adTitleInput = await selectById(client, 'id.freemo:id/et_ads_title')
  await adTitleInput.addValue(TEST_TITLE)

  const adDescInput = await selectById(client, 'id.freemo:id/et_ads_description')
  await adDescInput.addValue(TEST_DESCRIPTION)

  // Scroll down
  await client.touchAction([
    { action: 'press', x: 469, y: 1008 },
    { action: 'moveTo', x: 475, y: 185 },
    'release'
  ])

  await sleep(3000)

  // Throw exception if remaining ad balance is below 50000
  let remainingAdBalance = await selectById(client, 'id.freemo:id/et_ads_balance_remaining')
  remainingAdBalance = await remainingAdBalance.getText()
  remainingAdBalance = remainingAdBalance.match(/(\d+.?)+/)[0]
  remainingAdBalance = remainingAdBalance.replace('.', '')
  remainingAdBalance = remainingAdBalance.replace('.', '')
  remainingAdBalance = parseInt(remainingAdBalance)
  console.log(remainingAdBalance)
  if(remainingAdBalance < 50000) {
    throw("Remaining Ad balance is less than 50000, cannot create ad")
  }

  const adURLInput = await selectById(client, 'id.freemo:id/et_ads_url')
  await adURLInput.addValue(TEST_VID_URL)

  let btnContinue = await selectById(client, 'id.freemo:id/btn_continue')
  await btnContinue.click()

  /**
   * Step 2
   */
  // Select Gender
  const selectGender = await selectById(client, 'id.freemo:id/et_ads_gender')
  await selectGender.click()
  const genderSelectRecyclerView = await selectById(client, 'id.freemo:id/recyclerView')
  const maleSelect = await genderSelectRecyclerView.$("android.widget.LinearLayout")
  await maleSelect.click()
  let btnSubmit = await selectById(client, 'id.freemo:id/btn_submit')
  await btnSubmit.click()

  // Select Age
  const selectAge = await selectById(client, 'id.freemo:id/et_ads_age')
  await selectAge.click()
  const ageSelectRecyclerView = await selectById(client, 'id.freemo:id/recyclerView')
  const ageChoice = await ageSelectRecyclerView.$("android.widget.LinearLayout")
  await ageChoice.click()
  btnSubmit = await selectById(client, 'id.freemo:id/btn_submit')
  await btnSubmit.click()

  // Select membership
  const selectMembership = await selectById(client, 'id.freemo:id/et_ads_membership')
  await selectMembership.click()
  const membershipRecyclerView = await selectById(client, 'id.freemo:id/recyclerView')
  const membershipChoice = await membershipRecyclerView.$("android.widget.LinearLayout")
  await membershipChoice.click()
  btnSubmit = await selectById(client, 'id.freemo:id/btn_submit')
  await btnSubmit.click()

  // Select location
  const selectLocation = await selectById(client, 'id.freemo:id/et_ads_location')
  await selectLocation.click()
  const locationRecyclerView = await selectById(client, 'id.freemo:id/recyclerView')
  const locationChoice = await locationRecyclerView.$("android.widget.LinearLayout")
  await locationChoice.click()
  btnSubmit = await selectById(client, 'id.freemo:id/btn_submit')
  await btnSubmit.click()

  // Select hobby
  const selectHobby = await selectById(client, 'id.freemo:id/et_ads_hobby')
  await selectHobby.click()
  const hobbyRecyclerView = await selectById(client, 'id.freemo:id/recyclerView')
  const hobbyChoice = await hobbyRecyclerView.$("android.widget.LinearLayout")
  await hobbyChoice.click()
  btnSubmit = await selectById(client, 'id.freemo:id/btn_submit')
  await btnSubmit.click()

  // Scroll down
  await client.touchAction([
    { action: 'press', x: 466, y: 1228 },
    { action: 'moveTo', x: 460, y: 304 },
    'release'
  ])
  await sleep(3000)

  // Continue to step 3
  btnContinue = await selectById(client, 'id.freemo:id/btn_continue')
  await btnContinue.click()

  /**
   * Step 3
   */
  // Insert video url
  const videoAdLinkInput = await selectById(client, 'id.freemo:id/et_video_ads_link')
  await videoAdLinkInput.addValue(TEST_VID_URL)

  // Upload image for video logo
  const videoLogoInput = await selectById(client, 'id.freemo:id/iv_photo_logo')
  await videoLogoInput.click()
  resolvers = await selectById(client, 'android:id/resolver_list')
  innerLayout = await resolvers.$('android.widget.LinearLayout')
  photo = await innerLayout.$('android.widget.LinearLayout')
  await photo.click()
  await sleep(3000)

  image = await client.$(`android=new UiSelector().text("Image")`)
  await image.click()
  await sleep(3000)

  imagesRecyclerView = await selectById(client, 'com.google.android.apps.photos:id/recycler_view')
  image = await imagesRecyclerView.$(`android=new UiSelector().className("android.view.ViewGroup").instance(1)`)
  await image.click()

  // Click save button
  // Save
  const btnSave = await selectById(client, 'id.freemo:id/btn_save')
  await btnSave.click()

  await sleep(10000)

  // Assert that pop up success shows
  try {
    const successMessage = await selectById(client, 'android:id/message')
    const text = await successMessage.getText()
    assert.equal(text, 'Success')
    console.log('Create Video Ad test success =====================')
  } catch (ex) {
    console.log('Create Video Ad test failed =====================')
  }

  client.deleteSession()
}

module.exports = createVideoAd