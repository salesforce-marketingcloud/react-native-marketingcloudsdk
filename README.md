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

### URL Handling

The SDK doesn’t automatically present URLs from these sources.

* CloudPage URLs from push notifications
* OpenDirect URLs from push notifications
* Action URLs from in-app messages

To handle URLs from push notifications, you'll need to implement the following for Android and iOS.

#### Android

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
        // Here we set the URL handler to present URLs from CloudPages, OpenDirect, and In-App Messages
        .setUrlHandler((context, s, s1) -> PendingIntent.getActivity(
            context, 
            new Random().nextInt(), 
            new Intent(Intent.ACTION_VIEW, Uri.parse(s)), 
            PendingIntent.FLAG_UPDATE_CURRENT
        )).build(this));

        return null;
    }), initializationStatus -> {
        Log.e("TAG", "STATUS "+initializationStatus);
        if (initializationStatus.getStatus() == 1) {
            Log.e("TAG", "STATUS SUCCESS");
        }
        return null;
    });

    // The rest of the onCreate method
}
```

#### iOS

```objc
// AppDelegate.h ----

#import <MarketingCloudSDK/MarketingCloudSDK.h>
#import <SFMCSDK/SFMCSDK.h>

...

// Implement the SFMCSdkURLHandlingDelegate delegate
@interface AppDelegate : RCTAppDelegate<UNUserNotificationCenterDelegate, SFMCSdkURLHandlingDelegate>

// AppDelegate.mm ----

// This method is called after successfully initializing the SFMCSdk
- (void)pushSetup {
  dispatch_async(dispatch_get_main_queue(), ^{
    // Here we set the URL Handling delegate to present URLs from CloudPages, OpenDirect, and In-App Messages
    [[SFMCSdk mp] setURLHandlingDelegate:self];

    // Set UNUserNotificationCenter delegate, register for remote notifications, etc...
  });
}

// ...

// Implement the required delegate method to handle URLs
- (void)sfmc_handleURL:(NSURL * _Nonnull)url type:(NSString * _Nonnull)type {
    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:^(BOOL success) {
            if (success) {
                NSLog(@"url %@ opened successfully", url);
            } else {
                NSLog(@"url %@ could not be opened", url);
            }
        }];
    }
}

```

Please also see additional documentation on URL Handling for [Android](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/sdk-implementation/url-handling.html) and [iOS](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/sdk-implementation/implementation-urlhandling.html).

## API Reference <a name="reference"></a>

**Kind**: global class  

* [MCReactModule](#MCReactModule)
    * [.isPushEnabled()](#MCReactModule.isPushEnabled) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.enablePush()](#MCReactModule.enablePush)
    * [.disablePush()](#MCReactModule.disablePush)
    * [.getSystemToken()](#MCReactModule.getSystemToken) ⇒ <code>Promise.&lt;?string&gt;</code>
    * [.getAttributes()](#MCReactModule.getAttributes) ⇒ <code>Promise.&lt;Object.&lt;string, string&gt;&gt;</code>
    * [.setAttribute(key, value)](#MCReactModule.setAttribute)
    * [.clearAttribute(key)](#MCReactModule.clearAttribute)
    * [.addTag(tag)](#MCReactModule.addTag)
    * [.removeTag(tag)](#MCReactModule.removeTag)
    * [.getTags()](#MCReactModule.getTags) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.setContactKey(contactKey)](#MCReactModule.setContactKey)
    * [.getContactKey()](#MCReactModule.getContactKey) ⇒ <code>Promise.&lt;?string&gt;</code>
    * [.enableLogging()](#MCReactModule.enableLogging)
    * [.disableLogging()](#MCReactModule.disableLogging)
    * [.logSdkState()](#MCReactModule.logSdkState)
    * [.track(event)](#MCReactModule.track)
    * [.getDeviceId()](#MCReactModule.getDeviceId) ⇒ <code>Promise.&lt;?string&gt;</code>
    * [.setAnalyticsEnabled(analyticsEnabled)](#MCReactModule.setAnalyticsEnabled)
    * [.isAnalyticsEnabled()](#MCReactModule.isAnalyticsEnabled) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.setPiAnalyticsEnabled(analyticsEnabled)](#MCReactModule.setPiAnalyticsEnabled)
    * [.isPiAnalyticsEnabled()](#MCReactModule.isPiAnalyticsEnabled) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="MCReactModule.isPushEnabled"></a>

### MCReactModule.isPushEnabled() ⇒ <code>Promise.&lt;boolean&gt;</code>
The current state of the pushEnabled flag in the native Marketing Cloud
SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise to the boolean representation of whether push is
    enabled.  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/is-push-enabled.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)pushEnabled)

<a name="MCReactModule.enablePush"></a>

### MCReactModule.enablePush()
Enables push messaging in the native Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.push/-push-message-manager/enable-push.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)setPushEnabled:)

<a name="MCReactModule.disablePush"></a>

### MCReactModule.disablePush()
Disables push messaging in the native Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.push/-push-message-manager/disable-push.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)setPushEnabled:)

<a name="MCReactModule.getSystemToken"></a>

### MCReactModule.getSystemToken() ⇒ <code>Promise.&lt;?string&gt;</code>
Returns the token used by the Marketing Cloud to send push messages to
the device.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;?string&gt;</code> - A promise to the system token string.  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/get-system-token.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)deviceToken)

<a name="MCReactModule.getAttributes"></a>

### MCReactModule.getAttributes() ⇒ <code>Promise.&lt;Object.&lt;string, string&gt;&gt;</code>
Returns the maps of attributes set in the registration.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;Object.&lt;string, string&gt;&gt;</code> - A promise to the key/value map of attributes set
    in the registration.  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/get-attributes.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)attributes)

<a name="MCReactModule.setAttribute"></a>

### MCReactModule.setAttribute(key, value)
Sets the value of an attribute in the registration.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/-s-f-m-c%20-s-d-k/com.salesforce.marketingcloud.sfmcsdk.components.identity/-identity/set-profile-attribute.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)setProfileAttributes:)


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the attribute to be set in the     registration. |
| value | <code>string</code> | The value of the `key` attribute to be set in     the registration. |

<a name="MCReactModule.clearAttribute"></a>

### MCReactModule.clearAttribute(key)
Clears the value of an attribute in the registration.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/-editor/clear-attribute.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)clearProfileAttributeWithKey:)


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the attribute whose value should be     cleared from the registration. |

<a name="MCReactModule.addTag"></a>

### MCReactModule.addTag(tag)
**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/-editor/add-tag.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)addTag:)


| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag to be added to the list of tags in the     registration. |

<a name="MCReactModule.removeTag"></a>

### MCReactModule.removeTag(tag)
**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/-editor/remove-tag.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)removeTag:)


| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag to be removed from the list of tags in the     registration. |

<a name="MCReactModule.getTags"></a>

### MCReactModule.getTags() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns the tags currently set on the device.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - A promise to the array of tags currently set in the native SDK.  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/get-tags.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)tags)

<a name="MCReactModule.setContactKey"></a>

### MCReactModule.setContactKey(contactKey)
Sets the contact key for the device's user.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/-s-f-m-c%20-s-d-k/com.salesforce.marketingcloud.sfmcsdk.components.identity/-identity/set-profile-id.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)setProfileId:)


| Param | Type | Description |
| --- | --- | --- |
| contactKey | <code>string</code> | The value to be set as the contact key of     the device's user. |

<a name="MCReactModule.getContactKey"></a>

### MCReactModule.getContactKey() ⇒ <code>Promise.&lt;?string&gt;</code>
Returns the contact key currently set on the device.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;?string&gt;</code> - A promise to the current contact key.  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/get-contact-key.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)contactKey)

<a name="MCReactModule.enableLogging"></a>

### MCReactModule.enableLogging()
Enables verbose logging within the native Marketing Cloud SDK and Unified SFMC SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/troubleshooting-android.html#check-the-sdks-log-output)
- [iOS Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/troubleshooting-ios.html#check-the-sdks-log-output)

<a name="MCReactModule.disableLogging"></a>

### MCReactModule.disableLogging()
Disables verbose logging within the native Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/trouble-shooting/loginterface.html)
- [iOS Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/troubleshooting-ios.html#check-the-sdks-log-output)

<a name="MCReactModule.logSdkState"></a>

### MCReactModule.logSdkState()
Instructs the native SDK to log the SDK state to the native logging system (Logcat for
Android and Xcode/Console.app for iOS).  This content can help diagnose most issues within
the SDK and will be requested by the Marketing Cloud support team.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/-s-f-m-c%20-s-d-k/com.salesforce.marketingcloud.sfmcsdk/-s-f-m-c-sdk/get-sdk-state.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SFMCSdk.html#/c:@M@SFMCSDK@objc(cs)SFMCSdk(cm)state)

<a name="MCReactModule.track"></a>

### MCReactModule.track(event)
This method helps to track events, which could result in actions such as an InApp Message being displayed.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/event-tracking.html)


| Param | Type | Description |
| --- | --- | --- |
| event | [<code>CustomEvent</code>](#CustomEvent) \| [<code>EngagementEvent</code>](#EngagementEvent) \| <code>IdentityEvent</code> \| [<code>SystemEvent</code>](#SystemEvent) \| <code>CartEvent</code> \| <code>OrderEvent</code> \| <code>CatalogObjectEvent</code> | The event to be tracked. |

<a name="MCReactModule.getDeviceId"></a>

### MCReactModule.getDeviceId() ⇒ <code>Promise.&lt;?string&gt;</code>
Returns the deviceId used by the Marketing Cloud to send push messages to the device.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;?string&gt;</code> - A promise to the device Id.  
**See**

- [Android Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.registration/-registration-manager/get-device-id.html)
- [iOS Docs](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)deviceIdentifier)

<a name="MCReactModule.setAnalyticsEnabled"></a>

### MCReactModule.setAnalyticsEnabled(analyticsEnabled)
Enables or disables analytics in the Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/runtime-toggles.html)


| Param | Type | Description |
| --- | --- | --- |
| analyticsEnabled | <code>boolean</code> | A flag indicating whether analytics should be enabled. |

<a name="MCReactModule.isAnalyticsEnabled"></a>

### MCReactModule.isAnalyticsEnabled() ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if analytics is enabled in the Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise to the boolean representation of whether analytics is enabled.  
**See**

- [Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/runtime-toggles.html)

<a name="MCReactModule.setPiAnalyticsEnabled"></a>

### MCReactModule.setPiAnalyticsEnabled(analyticsEnabled)
Enables or disables Predictive Intelligence analytics in the Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**See**

- [Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/runtime-toggles.html)


| Param | Type | Description |
| --- | --- | --- |
| analyticsEnabled | <code>boolean</code> | A flag indicating whether PI analytics should be enabled. |

<a name="MCReactModule.isPiAnalyticsEnabled"></a>

### MCReactModule.isPiAnalyticsEnabled() ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if Predictive Intelligence analytics is enabled in the Marketing Cloud SDK.

**Kind**: static method of [<code>MCReactModule</code>](#MCReactModule)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise to the boolean representation of whether PI analytics is enabled.  
**See**

- [Docs](https://developer.salesforce.com/docs/marketing/mobilepush/guide/runtime-toggles.html)


### 3rd Party Product Language Disclaimers
Where possible, we changed noninclusive terms to align with our company value of Equality. We retained noninclusive terms to document a third-party system, but we encourage the developer community to embrace more inclusive language. We can update the term when it’s no longer required for technical accuracy.
