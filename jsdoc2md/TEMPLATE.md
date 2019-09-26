# Salesforce Marketing Cloud React Native 

Use this module to implement the Marketing Cloud MobilePush SDK for your [iOS](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/) and [Android](http://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/) applications.

## Release Notes

Release notes for the plugin can be found [here](CHANGELOG.md)

## Installation

#### 1. Add plugin to your application via [npm](https://www.npmjs.com/package/react-native-marketingcloudsdk)

```shell
npm install react-native-marketingcloudsdk --save
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

`android/settings.gradle`
```java
// ...
// Add the following lines:
include ':react-native-marketingcloudsdk'
project(':react-native-marketingcloudsdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-marketingcloudsdk/android')
```

`android/app/build.gradle`
```java
// ...
dependencies {
  // ...
  // Add the following line:
  implementation project(':react-native-marketingcloudsdk')
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
    classpath 'com.google.gms:google-services:4.2.0'
  }
}
```
3. Apply the plugin
`android/app/build.gradle`
```groovy
// Add the following line to the bottom of the file:
apply plugin: 'com.google.gms.google-services
```

#### 3. Configure the SDK in your MainApplication.java class

```java
// ...
// Add the following lines:
import android.util.Log;
import com.salesforce.marketingcloud.MarketingCloudConfig;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions;
```

```java
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.asList(
    // ...
    // Add the following line:
    new RNMarketingCloudSdk()
  );
}
```

```java
@Override
public void onCreate() {
    super.onCreate();

    MarketingCloudSdk.init(this,
            MarketingCloudConfig.builder()
                    .setApplicationId("{MC_APP_ID}")
                    .setAccessToken("{MC_ACCESS_TOKEN}")
                    .setSenderId("{FCM_SENDER_ID_FOR_MC_APP}")
                    .setMarketingCloudServerUrl("{MC_APP_SERVER_URL}")
                    .setNotificationCustomizationOptions(NotificationCustomizationOptions.create(R.drawable.ic_notification))
                    .setAnalyticsEnabled(true)
                    .build(this),
            initializationStatus -> Log.e("INIT", initializationStatus.toString()));

    // ... The rest of the onCreate method    
}
```

### iOS Setup

#### 1. Install pod for Marketing Cloud SDK

Add the SDK in ios/Pod.file
```shell
pod 'RNMarketingCloudSdk', :path => '../node_modules/react-native-marketingcloudsdk'
```
In terminal run the following command:
```shell
cd ios
pod install
```

#### 2. Configure the SDK in your AppDelegate.m class

```objc
#import <MarketingCloudSDK/MarketingCloudSDK.h>
````

```objc
- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    MarketingCloudSDKConfigBuilder *mcsdkBuilder = [MarketingCloudSDKConfigBuilder new];
    [mcsdkBuilder sfmc_setApplicationId:@"{MC_APP_ID}"];
    [mcsdkBuilder sfmc_setAccessToken:@"{MC_ACCESS_TOKEN}"];
    [mcsdkBuilder sfmc_setAnalyticsEnabled:@(YES)];
    [mcsdkBuilder sfmc_setMarketingCloudServerUrl:@"{MC_APP_SERVER_URL}"];

    NSError *error = nil;
    BOOL success =
        [[MarketingCloudSDK sharedInstance] sfmc_configureWithDictionary:[mcsdkBuilder sfmc_build]
                                                                   error:&error];

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

### Javascript

Import the SKD in your js file:

```javascript
import MCReactModule from 'react-native-marketingcloudsdk'
```