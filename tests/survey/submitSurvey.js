/**
 * Test Submit Survey
 * - User mengisi survey dan submit.
 * - User akan mendapat reward, dan wallet balance bertambah
 * 
 * Note:
 * Tes ini memerlukan ketersediaan survey yang belum disubmit oleh user.
 * Jika tidak ada survey yang bisa available untuk user,
 * Untuk keperluan testing, ada 2 cara:
 * 
 * Merubah row pada database, atau
 * Membuat survey baru
 * 
 * ----------------------------------
 * Merubah row pada database
 * ----------------------------------
 * Table: survey_participation_answers
 *  SELECT * FROM survey_participation_answers
 *  where survey_participation_id = (
 *    select id from survey_participations
 *    where user_id = {user id yg digunakan untuk testing}
 *  );
 *
 *  hapus semua row yg survey_participation_id nya ingin di hapus.
 *
 *  lanjut ke
 *
 *  Table: survey_participations
 *  SELECT * FROM survey_participations
 *  where user_id = {user id yang digunakan untuk testing};
 *  
 *  Hapus row yang survey_id nya adalah survey yang ingin di testing
 *
 * ----------------------------------
 * Membuat Survey Baru
 * ----------------------------------
 * Login ke admin laravel nova, dan buat survey baru 
 * 
 */
const goToLogin = require('../../setup/goToLogin')
const authenticate = require('../../setup/authenticate')
const selectById = require('../../helpers/selectById')
const sleep = require('../../helpers/sleep')
const clearUpdateToast = require('../../helpers/clearUpdateToast')
const assert = require('assert')
const testSummary = require('../../helpers/testSummary')

const TEST_CASE = 'submit_survey'

const setup = async (USER_PHONE) => {
  let client = await goToLogin()
  client = await authenticate(client, USER_PHONE)
  return client
}

const submitSurvey = async(USER_PHONE) => {
  const client = await setup(USER_PHONE)
  try {

    // Clear Update Toast
    await clearUpdateToast(client)

    const surveyAction = await selectById(client, 'id.freemo:id/action_survey')
    await surveyAction.click()

    try {
      const btnStart = await selectById(client, 'id.freemo:id/btn_questioner_start')
      await btnStart.click()
    } catch (ex) {
      throw("There is no survey available. Create a new survey or make survey available for user from db")
    }

    let btnSubmit
    let isMoreQuestion = true
    while(isMoreQuestion) {
      try {
        btnSubmit = await selectById(client, 'id.freemo:id/btn_questioner_start')
        const text = await btnSubmit.getText()
        if (text === 'Submit') {
          break
        }
        if (text === 'Survey submitted') {
          console.log('Survey Submit Failed ====================')
          const err = 'There is no available survey. \nCreate a new survey or make a survey available by making changes to database'
          console.log(err)
          testSummary.addResult(TEST_CASE, false, err)
          client.deleteSession()
          return
        }
      } catch (ex) {
        console.log(ex)
      }

      let btnContinue
      try {
        // Check if continue button is in view
        btnContinue = await selectById(client, 'id.freemo:id/btn_question_continue')
      } catch (ex) {
        console.log(ex)
      }

      // Check if question is multiple choice
      try {
        const rvAnswers = await selectById(client, 'id.freemo:id/rv_answer')
        const firstChoice = await rvAnswers.$('android=new UiSelector().className("android.widget.LinearLayout").instance(0)')
        await firstChoice.click()
        await btnContinue.click()
        continue
      } catch (ex) {
        console.log(ex)
      }

      // Check if question is text input
      try {
        const answerInput = await selectById(client, 'id.freemo:id/et_answer')
        await answerInput.addValue('test')
        await btnContinue.click()
        continue
      } catch (ex) {
        console.log(ex)
      }
    }

    btnSubmit = await selectById(client, 'id.freemo:id/btn_questioner_start')
    await btnSubmit.click()

    await sleep(5000)

    // Assert that pop up success shows
    try {
      const activity = await client.getCurrentActivity()
      assert.equal(activity, '.core.wallet.WalletActivity')
      console.log('Survey Submit Test Success ============== ')
      testSummary.addResult(TEST_CASE, true)
    } catch (ex) {
      console.log('Survey Submit Failed ====================')
      testSummary.addResult(TEST_CASE, false, ex)
    }
    await client.deleteSession()
  } catch(ex) {
    testSummary.addResult(TEST_CASE, false, ex)
    await client.deleteSession()
  }

}

module.exports = submitSurvey
