const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'VIEW_SURVEY'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const viewSurvey = async (USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    /**
     * Do test steps here
     */

    const surveyAction = await selectById(client, 'id.freemo:id/action_survey')
    await surveyAction.click()

    try {
      const surveyTitle = await selectById(client, 'id.freemo:id/tv_greetings_title')
      const surveyImage = await selectById(client, 'id.freemo:id/iv_greetings')
      const surveyDescription = await selectById(client, 'id.freemo:id/tv_greetings_desc')
      assert(surveyTitle !== null)
      assert(surveyImage !== null)
      assert(surveyDescription !== null)
      console.log(`${TEST_CASE} Success =================`)
      testSummary.addResult(TEST_CASE, true)
    } catch(ex) {
      console.log(`${TEST_CASE} Failed =================`, ex)
      testSummary.addResult(TEST_CASE, false, ex)
    }
  } catch(ex) {
    console.log(`${TEST_CASE} Failed =================`, ex)
    testSummary.addResult(TEST_CASE, false, ex)
  }
  client.deleteSession()
}

module.exports = viewSurvey