# Enable Push for iOS

1. Enable push notifications in your target’s Capabilities settings in Xcode.

    ![push enablement](https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/assets/SDKConfigure6.png)

2. Set your AppDelegate class to adhere to the `UNUserNotificationCenterDelegate` protocol.
    ```objc
    @interface AppDelegate : RCTAppDelegate<UNUserNotificationCenterDelegate>
    ```

2.  Extend the SDK configuration code outlined in [Configure the SDK](./README.md#2-configure-the-sdk-in-your-appdelegatem-class) to add support for push registration.

    ```objc
    // Other imports ...
    #import <MarketingCloudSDK/MarketingCloudSDK.h>
    #import <SFMCSDK/SFMCSDK.h>

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
        [[SFMCSdk mp] setDeviceToken:deviceToken];
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
        [[SFMCSdk mp] setNotificationRequest:response.notification.request];

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
        [[SFMCSdk mp] setNotificationUserInfo:userInfo];

        completionHandler(UIBackgroundFetchResultNewData);
    }


    @end
    ```

3. **Enable Rich Notifications:** Rich notifications include images, videos, titles and subtitles from the MobilePush app, and mutable content. Mutable content can include personalization in the title, subtitle, or body of your message. 
    1. In Xcode, click **File**
    2. Click **New**
    3. Click **Target**
    4. Select Notification Service Extension
    5. Name and save the new extension

    This service extension checks for a “_mediaUrl” element in request.content.userInfo. If found, the extension attempts to download the media from the URL , creates a thumbnail-size version, and then adds the attachment. The service extension also checks for a ““_mediaAlt” element in request.content.userInfo. If found, the service extension uses the element for the body text if there are any problems downloading or creating the media attachment.

    A service extension can timeout when it is unable to download. In this code sample, the service extension delivers the original content with the body text changed to the value in “_mediaAlt”.

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
