const opts = {
  port: 4723,
  capabilities: {
    deviceName: "Android Emulator",
    platformName: "Android",
    platformVersion: "7",
    udid: "emulator-5554",
    appPackage: "id.freemo",
    appActivity: "id.freemo.core.splashscreen.SplashScreenActivity",
    automationName: 'UiAutomator2'
  }
}

module.exports = opts
