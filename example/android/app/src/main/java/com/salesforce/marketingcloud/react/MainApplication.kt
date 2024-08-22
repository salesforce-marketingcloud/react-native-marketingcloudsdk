package com.salesforce.marketingcloud.react

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

import android.util.Log
import com.salesforce.marketingcloud.MarketingCloudConfig
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions
import com.salesforce.marketingcloud.sfmcsdk.InitializationStatus
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdkModuleConfig

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }

 SFMCSdk.configure(
            applicationContext,
            SFMCSdkModuleConfig.build {
                pushModuleConfig =
                    MarketingCloudConfig.builder()
                        .apply {
                            //Update these details based on your MC config
                            setApplicationId("16586d33-807c-4e1a-9a73-feb54a5c4ad1")
                            setAccessToken("v9q3gd5ysstjrwv2vqcst296")
                            setMarketingCloudServerUrl("https://mcgrjfgk81ckrt0h4rwlnbhmbvf4.device.marketingcloudapis.com/")
                            setSenderId("348137931902")
                            setNotificationCustomizationOptions(
                                NotificationCustomizationOptions.create(
                                    R.mipmap.ic_launcher
                                )
                            )
                        }
                        .build(applicationContext)
            }
        ) { initStatus ->
            when (initStatus.status) {
                InitializationStatus.SUCCESS -> Log.d("SFMC", "SFMC SDK Initialization Successful")
                InitializationStatus.FAILURE -> Log.d("SFMC", "SFMC SDK Initialization Failed")
                else -> Log.d("SFMC", "SFMC SDK Initialization Status: Unknown")
            }
        }




  }
}
