# Salesforce Marketing Cloud React Native 

Use this module to implement the Marketing Cloud MobilePush SDK for your [iOS](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/) and [Android](http://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/) applications.

## Release Notes

Release notes for the plugin can be found [here](CHANGELOG.md)

## Upgrading from 7.x to 8.x
After updating the dependency from 7.x to 8.x via npm or yarn. Please follow below steps:

#### iOS
- Import both `SFMCSDK` and `MarketingCloudSDK` in `AppDelegate` and update the configuration of the SDK as outlined in [Step 2 Configure the SDK for iOS](#2-configure-the-sdk-in-your-appdelegatem-class).
- Update the delegate methods and verify your implementation by following [iOS guide](./ios_push.md).

#### Android
Ensure that you import `SFMCSdk` and properly configure the SDK as specified in  [Step 3 Configure the SDK for Android](#3-configure-the-sdk-in-your-mainapplicationjava-class), which details the process of configuring the SDK for Android in this guide.

## Installation

* Plugin has a version dependency on React Native v0.60+

#### 1. Add plugin to your application via [npm](https://www.npmjs.com/package/react-native-marketingcloudsdk)

```shell
npm install react-native-marketingcloudsdk --save
```
or via [yarn](https://yarnpkg.com/package/react-native-marketingcloudsdk)

```shell
yarn add react-native-marketingcloudsdk
```

### Android Setup

#### 1. Add Marketing Cloud SDK repository

`android/build.gradle`
```groovy
allprojects {
    repositories {
        maven { url "https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/repository" }
        //... Other repos
    }
}
```

#### 2. Provide FCM credentials

1. To enable push support for the Android platform you will need to include the google-services.json file.  Download the file from your Firebase console and place it into the `android/app` directory

2. Include the Google Services plugin in your build
`android/build.gradle`
```groovy
buildscript {
  repositories {
    google()  // Google's Maven repository
  }

  dependencies {
    // ...
    // Add the following line:
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```
3. Apply the plugin
`android/app/build.gradle`
```groovy
// Add the google services plugin to your build.gradle file
apply plugin: 'com.google.gms.google-services'
```

#### 3. Configure the SDK in your MainApplication.java class

```java
@Override
public void onCreate() {
  super.onCreate();

  SFMCSdk.configure((Context) this, SFMCSdkModuleConfig.build(builder -> {
      builder.setPushModuleConfig(MarketingCloudConfig.builder()
              .setApplicationId("{MC_APP_ID}")
              .setAccessToken("{MC_ACCESS_TOKEN}")
              .setSenderId("{FCM_SENDER_ID_FOR_MC_APP}")
              .setMarketingCloudServerUrl("{MC_APP_SERVER_URL}")
              .setNotificationCustomizationOptions(NotificationCustomizationOptions.create(R.drawable.ic_notification))
              .setAnalyticsEnabled(true)
              .build(this));

      return null;
  }), initializationStatus -> {
      Log.e("TAG", "STATUS "+initializationStatus);
      if (initializationStatus.getStatus() == 1) {
          Log.e("TAG", "STATUS SUCCESS");
      }
      return null;
  });

    // ... The rest of the onCreate method    
}
```

### iOS Setup

#### 1. Install pod for Marketing Cloud SDK

```shell
// In your App, go to ios directory after installing plugin via npm or yarn.
cd ios
pod install
```

#### 2. Configure the SDK in your AppDelegate.m class

```objc
#import <MarketingCloudSDK/MarketingCloudSDK.h>
#import <SFMCSDK/SFMCSDK.h>
// Other imports ...

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    // Configure the SFMC sdk
    PushConfigBuilder *pushConfigBuilder = [[PushConfigBuilder alloc] initWithAppId:@"{MC_APP_ID}"];
    [pushConfigBuilder setAccessToken:@"{MC_ACCESS_TOKEN}"];
    [pushConfigBuilder setMarketingCloudServerUrl:[NSURL URLWithString:@"{MC_APP_SERVER_URL}"]];
    [pushConfigBuilder setMid:@"MC_MID"];
    [pushConfigBuilder setAnalyticsEnabled:YES];

    [SFMCSdk initializeSdk:[[[SFMCSdkConfigBuilder new] setPushWithConfig:[pushConfigBuilder build] onCompletion:^(SFMCSdkOperationResult result) {
        if (result == SFMCSdkOperationResultSuccess) {
        //Enable Push
        } else {
        // SFMC sdk configuration failed.
        NSLog(@"SFMC sdk configuration failed.");
        }
    }] build]];

    // ... The rest of the didFinishLaunchingWithOptions method  
}
```

#### 3. Enable Push

Follow [these instructions](./ios_push.md) to enable push for iOS.

## API Reference <a name="reference"></a>

{{#class name="MCReactModule"}}
{{>body~}}
{{>member-index~}}
{{>members~}}
{{/class}}

### InboxMessaging Module
{{#class name="SFMCInboxModule"}}
{{>body~}}
{{>member-index~}}
{{>members~}}
{{/class}}

### 3rd Party Product Language Disclaimers
Where possible, we changed noninclusive terms to align with our company value of Equality. We retained noninclusive terms to document a third-party system, but we encourage the developer community to embrace more inclusive language. We can update the term when it’s no longer required for technical accuracy.
