const selectById = async (client, resourceId) => {
  const selector = `new UiSelector().resourceId("${resourceId}")`
  const element = await client.$(`android=${selector}`)
  return element
}

module.exports = selectById