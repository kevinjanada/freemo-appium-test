const selectById = require('./selectById')

const clearUpdateToast = async (client) => {
  /**  
   * Handle Update App Toast,
   * Cancel Update
   * */
  try {
    // setTimeout(() => {
    //   return
    // }, 3000)
    const cancelButton = await selectById(client, 'android:id/button2')
    await cancelButton.click()
  } catch (ex) {
    console.log('no update app toast')
  }
}

module.exports = clearUpdateToast