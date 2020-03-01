const goToLogin = require('./setup/goToLogin')
const authentication = require('./tests/authentication')
const openAd = require('./tests/advertisement/openAd')

async function main () {
  let client = await goToLogin()
  client = await authentication(client)
  client = await openAd(client)
}

main()
