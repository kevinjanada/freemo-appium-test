const selectById = require('../helpers/selectById')
const assert = require('assert')

const authenticationTest = async (client) => {
  const mobilePhoneInput = await selectById(client, 'id.freemo:id/et_mobile_phone')
  mobilePhoneInput.addValue('87887240444')

  const signinBtn = await selectById(client, 'id.freemo:id/btn_signin')
  await signinBtn.click()

  for(let i = 1; i <= 6; i++) {
    let otp_i = await selectById(client, `id.freemo:id/et_otp_${i}`)
    otp_i.addValue('1')
  }

  const continueBtn = await selectById(client, `id.freemo:id/btn_continue`)
  await continueBtn.click()

  const startBtn = await selectById(client, `id.freemo:id/btn_start`)
  await startBtn.click()

  const currentActivity = await client.getCurrentActivity()
  assert.equal(currentActivity, '.core.main.MainActivity')

  return client
}

module.exports = authenticationTest
