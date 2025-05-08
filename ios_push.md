# Enable Push for iOS

1. Enable push notifications in your target’s Capabilities settings in Xcode.

    ![push enablement](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/assets/SDKConfigure6.png)

2. Set your AppDelegate class to adhere to the `UNUserNotificationCenterDelegate` protocol.
    ```objc
    //Other imports...
    #import <UserNotifications/UserNotifications.h>
    #import <MarketingCloudSDK/MarketingCloudSDK.h>
    #import <SFMCSDK/SFMCSDK.h>

    @interface AppDelegate : RCTAppDelegate<UNUserNotificationCenterDelegate, SFMCSdkURLHandlingDelegate>
    ```

3.  Extend the SDK configuration code outlined in [Configure the SDK](./README.md#2-configure-the-sdk-in-your-appdelegatem-class) to add support for push registration.

    ```objc

    @implementation AppDelegate

    - (BOOL)application:(UIApplication *)application
        didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        
        //RN setup
        self.moduleName = @"example";
        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        self.initialProps = @{};

        // Configure the SFMC sdk ...
        PushConfigBuilder *pushConfigBuilder = [[PushConfigBuilder alloc] initWithAppId:@"{MC_APP_ID}"];
        [pushConfigBuilder setAccessToken:@"{MC_ACCESS_TOKEN}"];
        [pushConfigBuilder setMarketingCloudServerUrl:[NSURL URLWithString:@"{MC_APP_SERVER_URL}"]];
        [pushConfigBuilder setMid:@"MC_MID"];
        [pushConfigBuilder setAnalyticsEnabled:YES];
         
        [SFMCSdk initializeSdk:[[[SFMCSdkConfigBuilder new] setPushWithConfig:[pushConfigBuilder build] onCompletion:^(SFMCSdkOperationResult result) {
          if (result == SFMCSdkOperationResultSuccess) {
            [self pushSetup];
          } else {
            // SFMC sdk configuration failed.
            NSLog(@"SFMC sdk configuration failed.");
          }
        }] build]];

        // ... The rest of the didFinishLaunchingWithOptions method 
        return [super application:application didFinishLaunchingWithOptions:launchOptions];
    }

    - (void)pushSetup {
        // AppDelegate adheres to the SFMCSdkURLHandlingDelegate protocol
        // and handles URLs passed back from the SDK in `sfmc_handleURL`.
        // For more information, see https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/sdk-implementation/implementation-urlhandling.html
        [SFMCSdk requestPushSdk:^(id<PushInterface> _Nonnull mp) {
            [mp setURLHandlingDelegate:self];
        }];
        
        dispatch_async(dispatch_get_main_queue(), ^{
          // set the UNUserNotificationCenter delegate - the delegate must be set here in
          // didFinishLaunchingWithOptions
          [UNUserNotificationCenter currentNotificationCenter].delegate = self;
          [[UIApplication sharedApplication] registerForRemoteNotifications];
          
          [[UNUserNotificationCenter currentNotificationCenter]
           requestAuthorizationWithOptions:UNAuthorizationOptionAlert |
           UNAuthorizationOptionSound |
           UNAuthorizationOptionBadge
           completionHandler:^(BOOL granted, NSError *_Nullable error) {
            if (error == nil) {
              if (granted == YES) {
                    NSLog(@"User granted permission");
              }
            }
          }];
        });
    }

    - (void)application:(UIApplication *)application
        didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
        [SFMCSdk requestPushSdk:^(id<PushInterface> _Nonnull mp) {
            [mp setDeviceToken:deviceToken];
        }];
    }

    - (void)application:(UIApplication *)application
        didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
        os_log_debug(OS_LOG_DEFAULT, "didFailToRegisterForRemoteNotificationsWithError = %@", error);
    }

    // The method will be called on the delegate when the user responded to the notification by opening
    // the application, dismissing the notification or choosing a UNNotificationAction. The delegate
    // must be set before the application returns from applicationDidFinishLaunching:.
    - (void)userNotificationCenter:(UNUserNotificationCenter *)center
        didReceiveNotificationResponse:(UNNotificationResponse *)response
                 withCompletionHandler:(void (^)(void))completionHandler {
        // tell the MarketingCloudSDK about the notification
        [SFMCSdk requestPushSdk:^(id<PushInterface> _Nonnull mp) {
            [mp setNotificationResponse:response];
        }];
        if (completionHandler != nil) {
            completionHandler();
        }
    }

    - (void)userNotificationCenter:(UNUserNotificationCenter *)center
           willPresentNotification:(UNNotification *)notification
             withCompletionHandler:
                 (void (^)(UNNotificationPresentationOptions options))completionHandler {
        NSLog(@"User Info : %@", notification.request.content.userInfo);
        completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert |
                          UNAuthorizationOptionBadge);
    }

    // This method is REQUIRED for correct functionality of the SDK.
    // This method will be called on the delegate when the application receives a silent push

    - (void)application:(UIApplication *)application
        didReceiveRemoteNotification:(NSDictionary *)userInfo
              fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
        [SFMCSdk requestPushSdk:^(id<PushInterface> _Nonnull mp) {
            [mp setNotificationUserInfo:userInfo];
        }];
        completionHandler(UIBackgroundFetchResultNewData);
    }
    
    //URL Handling
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

    @end
    ```
4. **Integrate the MobilePush Extension SDK:** The MobilePush SDK version 9.0.0 introduces two push notification features — Push Delivery events and support for Carousel template. To function properly, these features require iOS [Service Extension](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension) and [Content Extension](https://developer.apple.com/documentation/usernotificationsui/unnotificationcontentextension) added as additional targets in the main app. Then, integrate the MobilePush iOS Extension SDK MCExtensionSDK.


    >Implementing the **Service Extension** is required to enable **Push Delivery events**.    
    >Implementing both the **Service Extension** and **Content Extension** is required to support **Carousel template-based Push Notifications**.
    
    #### 1. Configure the Service Extension 
    This section will guide you through setting up and configuring the Notification Service Extension for use with the MobilePush iOS Extension SDK.

     - [Add a Service Extension Target](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#add-a-service-extension-target)

     - Integrate the Extension SDK with the Service Extension
       **Integrate the SDK with CocoaPods**: To add the SDK as a dependency in your app's Podfile, follow the instructions for [Adding pods to an Xcode project](https://guides.cocoapods.org/using/using-cocoapods.html) on the CocoaPods documentation site.  

       <img width="834" alt="Screenshot 2025-05-07 at 7 28 35 PM" src="https://git.soma.salesforce.com/sunny-agarwal/sdk-reactnative-plugin/assets/59256/66b45840-aeea-463b-809d-1eaf1b4f2488">

       After the installation process, open the `.xcworkspace` file created by CocoaPods using Xcode.  
       **__Avoid opening .xcodeproj directly. Opening a project file instead of a workspace can lead to errors.__**

     - [Inherit from SFMCNotificationService](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#inherit-from-sfmcnotificationservice)

     - [Additional Configuration](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#additional-configuration-options)
     
    #### 2. Configure the Content Extension 
    This section will guide you through setting up and configuring the Notification Content Extension for use with the MobilePush iOS Extension SDK.
    - [Add a Content Extension Target](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#add-a-content-extension-target)

    - Integrate the Extension SDK with Your Content Extension
      The process for integrating the MCExtensionSDK into your Content Extension mirrors the steps taken for your Service Extension. For detailed instructions, see [Integrate the Extension SDK with the Service Extension](integrate-the-extension-sdk-with-the-service-extension).

    - [Inherit from SFMCNotificationViewController](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#inherit-from-sfmcnotificationviewcontroller)

    - [Project and Info.plist Configuration](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#project-and-infoplist-configuration)

    - [Additional Configuration](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#additional-configuration)

    #### 3. [Enable App Groups Capability](https://developer.salesforce.com/docs/marketing/mobilepush/guide/ios-extension-sdk-integration.html#enable-app-groups-capability) 
    
5. **Enable Rich Notifications:** Rich notifications include images, videos, titles and subtitles from the MobilePush app, and mutable content. Mutable content can include personalization in the title, subtitle, or body of your message. 
    
    **Create a Notification Service Extension**
    
    Skip the setup steps if you've already integrated Notification Service Extension during the [MobilePush Extension SDK integration](#4-integrate-the-mobilepush-extension-sdk) and refer to the [sample code for integration with Extension SDK](#with-Extension-SDK-Integration).

    1. In Xcode, click **File**
    2. Click **New**
    3. Click **Target**
    4. Select Notification Service Extension
    5. Name and save the new extension

> The Notification Target must be signed with the same Xcode Managed Profile as the main project.

This service extension checks for a “_mediaUrl” element in request.content.userInfo. If found, the extension attempts to download the media from the URL , creates a thumbnail-size version, and then adds the attachment. The service extension also checks for a ““_mediaAlt” element in request.content.userInfo. If found, the service extension uses the element for the body text if there are any problems downloading or creating the media attachment.

A service extension can timeout when it is unable to download. In this code sample, the service extension delivers the original content with the body text changed to the value in “_mediaAlt”.

#### **<ins>Without Extension SDK Integration</ins>**
```objc
#import <CoreGraphics/CoreGraphics.h>
#import "NotificationService.h"

@interface NotificationService ()

@property(nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property(nonatomic, strong) UNMutableNotificationContent *modifiedNotificationContent;

@end

@implementation NotificationService

- (UNNotificationAttachment *)createMediaAttachment:(NSURL *)localMediaUrl {
    // options: specify what cropping rectangle of the media to use for a thumbnail
    //          whether the thumbnail is hidden or not
    UNNotificationAttachment *mediaAttachment = [UNNotificationAttachment
        attachmentWithIdentifier:@"attachmentIdentifier"
                            URL:localMediaUrl
                        options:@{
                            UNNotificationAttachmentOptionsThumbnailClippingRectKey :
                                (NSDictionary *)CFBridgingRelease(
                                    CGRectCreateDictionaryRepresentation(CGRectZero)),
                            UNNotificationAttachmentOptionsThumbnailHiddenKey : @NO
                        }
                        error:nil];
    return mediaAttachment;
}

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request
                withContentHandler:(void (^)(UNNotificationContent *_Nonnull))contentHandler {
    // save the completion handler we will call back later
    self.contentHandler = contentHandler;

    // make a copy of the notification so we can change it
    self.modifiedNotificationContent = [request.content mutableCopy];

    // alternative text to display if there are any issues loading the media URL
    NSString *mediaAltText = request.content.userInfo[@"_mediaAlt"];

    // does the payload contains a remote URL to download or a local URL?
    NSString *mediaUrlString = request.content.userInfo[@"_mediaUrl"];
    NSURL *mediaUrl = [NSURL URLWithString:mediaUrlString];

    // if we have a URL, try to download media (i.e.,
    // https://media.giphy.com/media/3oz8xJBbCpzG9byZmU/giphy.gif)
    if (mediaUrl != nil) {
        // create a session to handle downloading of the URL
        NSURLSession *session = [NSURLSession
            sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];

        // start a download task to handle the download of the media
        __weak __typeof__(self) weakSelf = self;
        [[session
            downloadTaskWithURL:mediaUrl
            completionHandler:^(NSURL *_Nullable location, NSURLResponse *_Nullable response,
                                NSError *_Nullable error) {
                BOOL useAlternateText = YES;

                // if the download succeeded, save it locally and then make an attachment
                if (error == nil) {
                    if (200 <= ((NSHTTPURLResponse *)response).statusCode &&
                        ((NSHTTPURLResponse *)response).statusCode <= 299) {
                        // download was successful, attempt save the media file
                        NSURL *localMediaUrl = [NSURL
                            fileURLWithPath:[location.path
                                                stringByAppendingString:mediaUrl
                                                                            .lastPathComponent]];

                        // remove any existing file with the same name
                        [[NSFileManager defaultManager] removeItemAtURL:localMediaUrl error:nil];

                        // move the downloaded file from the temporary location to a new file
                        if ([[NSFileManager defaultManager] moveItemAtURL:location
                                                                    toURL:localMediaUrl
                                                                    error:nil] == YES) {
                            // create an attachment with the new file
                            UNNotificationAttachment *mediaAttachment =
                                [weakSelf createMediaAttachment:localMediaUrl];

                            // if no problems creating the attachment, we can use it
                            if (mediaAttachment != nil) {
                                // set the media to display in the notification
                                weakSelf.modifiedNotificationContent.attachments =
                                    @[ mediaAttachment ];

                                // everything is ok
                                useAlternateText = NO;
                            }
                        }
                    }
                }

                // if any problems creating the attachment, use the alternate text if provided
                if ((useAlternateText == YES) && (mediaAltText != nil)) {
                    weakSelf.modifiedNotificationContent.body = mediaAltText;
                }

                // tell the OS we are done and here is the new content
                weakSelf.contentHandler(weakSelf.modifiedNotificationContent);
            }] resume];
    } else {
        // see if the media URL is for a local file  (i.e., file://movie.mp4)
        BOOL useAlternateText = YES;
        if (mediaUrlString != nil) {
            // attempt to create a URL to a file in local storage
            NSURL *localMediaUrl =
                [NSURL fileURLWithPath:[[NSBundle mainBundle]
                                        pathForResource:mediaUrlString.lastPathComponent
                                                            .stringByDeletingLastPathComponent
                                                    ofType:mediaUrlString.pathExtension]];

            // is the URL a local file URL?
            if (localMediaUrl != nil && localMediaUrl.isFileURL == YES) {
                // create an attachment with the local media
                UNNotificationAttachment *mediaAttachment =
                    [self createMediaAttachment:localMediaUrl];

                // if no problems creating the attachment, we can use it
                if (mediaAttachment != nil) {
                    // set the media to display in the notification
                    self.modifiedNotificationContent.attachments = @[ mediaAttachment ];

                    // everything is ok
                    useAlternateText = NO;
                }
            }
        }

        // if any problems creating the attachment, use the alternate text if provided
        if ((useAlternateText == YES) && (mediaAltText != nil)) {
            self.modifiedNotificationContent.body = mediaAltText;
        }

        // tell the OS we are done and here is the new content
        contentHandler(self.modifiedNotificationContent);
    }
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the
    // original push payload will be used.

    // we took too long to download the media URL, use the alternate text if provided
    NSString *mediaAltText = self.modifiedNotificationContent.userInfo[@"_mediaAlt"];
    if (mediaAltText != nil) {
        self.modifiedNotificationContent.body = mediaAltText;
    }

    // tell the OS we are done and here is the new content
    self.contentHandler(self.modifiedNotificationContent);
}

@end
```

#### **<ins>With Extension SDK Integration</ins>**
```objc
#import "NotificationService.h"
@implementation NotificationService
// Provide SFNotificationServiceConfig configuration
- (SFMCNotificationServiceConfig *)sfmcProvideConfig {
    SFMCExtensionSdkLogLevel logLevel = SFMCExtensionSdkLogLevelNone;
#if DEBUG
    logLevel = SFMCExtensionSdkLogLevelDebug;
#endif
    return [[SFMCNotificationServiceConfig alloc] initWithLogLevel: logLevel];
}
// Custom processing when notification is received
-(void)sfmcDidReceiveRequest:(UNNotificationRequest *)request mutableContent:(UNMutableNotificationContent *)mutableContent withContentHandler:(void (^)(NSDictionary * _Nullable))contentHandler {
    
    [self addMediaToContent:mutableContent completion:^{
        contentHandler(nil);
    }];
}
// Download and attach media
- (void)addMediaToContent:(UNMutableNotificationContent *)mutableContent
                completion:(void (^)(void))completion {
    
    NSString *mediaUrlString = mutableContent.userInfo[@"_mediaUrl"];
    if (mediaUrlString == nil || mediaUrlString.length == 0) {
        completion();
        return;
    }
    
    NSURL *mediaUrl = [NSURL URLWithString:mediaUrlString];
    if (!mediaUrl) {
        completion();
        return;
    }
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    
    NSURLSessionDownloadTask *downloadTask = [session downloadTaskWithURL:mediaUrl
                                                        completionHandler:^(NSURL * _Nullable location,
                                                                            NSURLResponse * _Nullable response,
                                                                            NSError * _Nullable error) {
        if (error) {
            completion();
            return;
        }
        
        if (!location || ![response isKindOfClass:[NSHTTPURLResponse class]]) {
            completion();
            return;
        }
        
        NSInteger statusCode = ((NSHTTPURLResponse *)response).statusCode;
        if (statusCode < 200 || statusCode > 299) {
            completion();
            return;
        }
        
        NSString *fileName = mediaUrl.lastPathComponent;
        NSString *destinationPath = [[location.path stringByAppendingString:fileName] copy];
        NSURL *localMediaUrl = [NSURL fileURLWithPath:destinationPath];
        
        [[NSFileManager defaultManager] removeItemAtURL:localMediaUrl error:nil];
        
        NSError *fileError;
        [[NSFileManager defaultManager] moveItemAtURL:location toURL:localMediaUrl error:&fileError];
        if (fileError) {
            completion();
            return;
        }
        
        UNNotificationAttachment *attachment = [UNNotificationAttachment attachmentWithIdentifier:@"SomeAttachmentId"
                                                                                                URL:localMediaUrl
                                                                                            options:nil
                                                                                            error:nil];
        if (attachment) {
            mutableContent.attachments = @[attachment];
        }
        
        completion();
    }];
    
    [downloadTask resume];
}
@end
```
