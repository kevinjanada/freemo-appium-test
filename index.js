const openAd = require('./tests/advertisement/openAd')
const openVideoAd = require('./tests/advertisement/openVideoAd')
const createImageAd = require('./tests/advertisement/createImageAd')
const createVideoAd = require('./tests/advertisement/createVideoAd')
const submitSurvey = require('./tests/survey/submitSurvey')

async function main () {
  // await openAd()
  // await openVideoAd()
  // await createImageAd()
  // await createVideoAd()
  await submitSurvey()
}

main()
