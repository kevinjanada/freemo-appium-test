const openAd = require('./tests/advertisement/openAd')
const openVideoAd = require('./tests/advertisement/openVideoAd')
const createImageAd = require('./tests/advertisement/createImageAd')
const createVideoAd = require('./tests/advertisement/createVideoAd')
const submitSurvey = require('./tests/survey/submitSurvey')
const editProfile = require('./tests/profile/editProfile')
const changeLanguage = require('./tests/profile/changeLanguage')
const withdrawRequest = require('./tests/wallet/withdrawRequest')
const topupRequest = require('./tests/wallet/topupRequest')


/**
 * USER_PHONE
 * 
 * nomer telfon yg digunakan untuk login
 */
const USER_PHONE = '87887240444'

/**
 * CREATE_IMAGE_AD_PARAMS
 * 
 * parameter untuk test createVideoAd
 */
const CREATE_IMAGE_AD_PARAMS = {
  TEST_TITLE: 'test-image-ad',
  TEST_DESCRIPTION: 'test-image-ad Description',
  TEST_URL: 'https://www.youtube.com',
}

/**
 * CREATE_VIDEO_AD_PARAMS
 * 
 * parameter untuk test createVideoAd
 */
const CREATE_VIDEO_AD_PARAMS = {
  TEST_TITLE: 'test-video-ad',
  TEST_DESCRIPTION: 'test-video-add Description',
  TEST_VID_URL: 'https://www.youtube.com/watch?v=ZLyGbQbCQrM',
}

/**
 * EDIT_PROFILE_PARAMS
 * 
 * parameter untuk test editProfile
 */
const EDIT_PROFILE_PARAMS = {
  TEST_USERNAME: 'test-username',
  TEST_FULLNAME: 'test fullname',
  TEST_EMAIL: 'test-email-input@gmail.com',
  TEST_ADDRESS: 'test address no. 3',
}

/**
 * TOPUP_TYPES
 * 
 * Untuk test topupRequest
 * example:
 * await topupRequest(TOPUP_TYPES.PLATINUM)
 */
const TOPUP_TYPES = {
  SILVER: { index: 0, text: 'Silver', price: 'Rp. 500,000' },
  GOLD: { index: 1, text: 'Gold', price: 'Rp. 2,500,000' },
  PLATINUM: { index: 2, text: 'Platinum', price: 'Rp. 10,000,000' },
  BRONZE: { index: 3, text: 'Bronze', price: 'Rp. 200,000' },
  CLASSIC: { index: 4, text: 'Classic', price: 'Rp. 100,000' }
}
/**
 * TEST_ACCOUNT_NAME
 * 
 * Untuk test:
 * - topupRequest
 * - withdrawRequest
 */
const TEST_ACCOUNT_NAME = 'test accountname'
/**
 * TEST_ACCOUNT_NUMBER
 * 
 * Untuk test:
 * - topupRequest
 * - withdrawRequest
 */
const TEST_ACCOUNT_NUMBER = '080808080808'

async function main () {
  // await openAd(USER_PHONE)
  // await openVideoAd(USER_PHONE)
  // await createImageAd(USER_PHONE, CREATE_IMAGE_AD_PARAMS)
  // await createVideoAd(USER_PHONE, CREATE_VIDEO_AD_PARAMS)
  // await submitSurvey(USER_PHONE)
  await editProfile(USER_PHONE, EDIT_PROFILE_PARAMS)
  // await changeLanguage(USER_PHONE)
  // await withdrawRequest(USER_PHONE, TEST_ACCOUNT_NAME, TEST_ACCOUNT_NUMBER)
  // await topupRequest(USER_PHONE, TOPUP_TYPES.PLATINUM, TEST_ACCOUNT_NAME, TEST_ACCOUNT_NUMBER)
}

main()
