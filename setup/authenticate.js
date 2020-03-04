/**
 * Authentication Test
 * 
 * Servis OTP masih blum aktif,
 * Verifikasi OTP di bypass di backend.
 */
const selectById = require('../helpers/selectById')
const sleep = require('../helpers/sleep')
const assert = require('assert')


const authenticationTest = async (client, MOBILE_PHONE) => {
  const mobilePhoneInput = await selectById(client, 'id.freemo:id/et_mobile_phone')
  mobilePhoneInput.addValue(MOBILE_PHONE)

  const signinBtn = await selectById(client, 'id.freemo:id/btn_signin')
  await signinBtn.click()

  for(let i = 1; i <= 6; i++) {
    let otp_i = await selectById(client, `id.freemo:id/et_otp_${i}`)
    otp_i.addValue('1')
  }

  const continueBtn = await selectById(client, `id.freemo:id/btn_continue`)
  await continueBtn.click()

  sleep(1000)

  const startBtn = await selectById(client, `id.freemo:id/btn_start`)
  await startBtn.click()

  const currentActivity = await client.getCurrentActivity()
  assert.equal(currentActivity, '.core.main.MainActivity')

  console.log('Authentication Success =================================')
  return client
}

module.exports = authenticationTest
