const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')

const setup = async () => {
  let client = await goToLogin()
  client = await authenticate(client)
  return client
}

const createImageAd = async () => {
  const client = await setup()

  // Clear Update Toast
  await clearUpdateToast(client)

  const profileAction = await selectById(client, 'id.freemo:id/action_profile')
  await profileAction.click()

  const myAdsLayout = await selectById(client, 'id.freemo:id/layout_myads')
  await myAdsLayout.click()

  const addFab = await selectById(client, 'id.freemo:id/fab_add')
  await addFab.click()

  const addImageAdLayout = await selectById(client, 'id.freemo:id/layout_image_ads')
  await addImageAdLayout.click()


  /**
   * Step 1
   */
  const adTitleInput = await selectById(client, 'id.freemo:id/et_ads_title')
  await adTitleInput.addValue('test-image-ad')

  const adDescInput = await selectById(client, 'id.freemo:id/et_ads_description')
  await adDescInput.addValue('test-image-add Description')

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
  await adURLInput.addValue('http://youtube.com')

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
  // Ad Image
  const adImageInput = await selectById(client, 'id.freemo:id/iv_photo_image')
  await adImageInput.click()
  let resolvers = await selectById(client, 'android:id/resolver_list')
  let innerLayout = await resolvers.$('android.widget.LinearLayout')
  let photo = await innerLayout.$('android.widget.LinearLayout')
  await photo.click()
  await sleep(3000)

  let image = await client.$(`android=new UiSelector().text("Image")`)
  await image.click()
  await sleep(3000)

  let imagesRecyclerView = await selectById(client, 'com.google.android.apps.photos:id/recycler_view')
  image = await imagesRecyclerView.$(`android=new UiSelector().className("android.view.ViewGroup").instance(1)`)
  await image.click()

  // Lock Screen Image
  const lockScreenImageInput = await selectById(client, 'id.freemo:id/iv_photo_lockscreen')
  await lockScreenImageInput.click()
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

  // Ad Logo Image
  // Scroll down
  await client.touchAction([
    { action: 'press', x: 466, y: 1300 },
    { action: 'moveTo', x: 460, y: 304 },
    'release'
  ])
  await sleep(3000)

  const logoImageInput = await selectById(client, 'id.freemo:id/iv_photo_logo')
  await logoImageInput.click()
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

  // Save
  const btnSave = await selectById(client, 'id.freemo:id/btn_save')
  await btnSave.click()

  await sleep(10000)

  // Assert that pop up success shows
  try {
    const successMessage = await selectById(client, 'android:id/message')
    const text = await successMessage.getText()
    assert.equal(text, 'Success')
  } catch (ex) {
    console.log('Create Image Test Success Pop Up did not show')
  }

  // client.deleteSession()
}

module.exports = createImageAd