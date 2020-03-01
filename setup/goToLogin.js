const wdio = require('webdriverio')
const config =  require('../config')
const selectById = require('../helpers/selectById')

const goToLogin = async () => {
  const client = await wdio.remote(config)

  const currentActivity = await client.getCurrentActivity()

  let activity = currentActivity
  try {
    await client.waitUntil(async () => {
      activity = await client.getCurrentActivity()
      return activity !== currentActivity
    })
  } catch (err) {
    console.log(err)
  }

  console.log('Now in onboarding activity ======== \n')
  setTimeout(() => {
    return
  }, 3000)

  // const button = await client.$("android.widget.Button")
  const selector = `new UiSelector().resourceId("id.freemo:id/btn_continue")`
  const button = await client.$(`android=${selector}`)

  for (let i = 0; i < 5; i++) {
    await button.click()
  }

  activity = await client.getCurrentActivity()
  console.log('Now in login activity ========= \n')


  // Click on Allow Permission
  const allowPermissionBtn = await selectById(client, 'com.android.packageinstaller:id/permission_allow_button')
  for (let i = 0; i < 3; i++) {
    await allowPermissionBtn.click()
  }

  return client
}

module.exports = goToLogin