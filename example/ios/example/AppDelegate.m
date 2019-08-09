// AppDelegate.m
//
// Copyright (c) 2019 Salesforce, Inc
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this
// list of conditions and the following disclaimer. Redistributions in binary
// form must reproduce the above copyright notice, this list of conditions and
// the following disclaimer in the documentation and/or other materials
// provided with the distribution. Neither the name of the nor the names of
// its contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.


#import "AppDelegate.h"

#import <MarketingCloudSDK/MarketingCloudSDK.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // configure the Marketing Cloud SDK
    MarketingCloudSDKConfigBuilder *mcsdkBuilder = [MarketingCloudSDKConfigBuilder new];
    [mcsdkBuilder sfmc_setApplicationId:@"{MC_APP_ID}"];
    [mcsdkBuilder sfmc_setAccessToken:@"{MC_ACCESS_TOKEN}"];
    [mcsdkBuilder sfmc_setAnalyticsEnabled:@(YES)];
    [mcsdkBuilder sfmc_setMarketingCloudServerUrl:@"{MC_APP_SERVER_URL}"];

    NSError *error = nil;
    BOOL success =
        [[MarketingCloudSDK sharedInstance] sfmc_configureWithDictionary:[mcsdkBuilder sfmc_build]
                                                                   error:&error];
    if (success == YES) {
        dispatch_async(dispatch_get_main_queue(), ^{
          if (@available(iOS 10, *)) {
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
                                          dispatch_async(dispatch_get_main_queue(), ^{
                                                         });
                                      }
                                  }
                                }];
          } else {
#if __IPHONE_OS_VERSION_MIN_REQUIRED < 100000
              UIUserNotificationSettings *settings = [UIUserNotificationSettings
                  settingsForTypes:UIUserNotificationTypeBadge | UIUserNotificationTypeSound |
                                   UIUserNotificationTypeAlert
                        categories:nil];
              [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
#endif
              [[UIApplication sharedApplication] registerForRemoteNotifications];
          }
        });
        RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
        RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                         moduleName:@"example"
                                                  initialProperties:nil];

        rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

        self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
        UIViewController *rootViewController = [UIViewController new];
        rootViewController.view = rootView;
        self.window.rootViewController = rootViewController;
        [self.window makeKeyAndVisible];
    } else {
        //  MarketingCloudSDK sfmc_configure failed
        os_log_debug(OS_LOG_DEFAULT, "MarketingCloudSDK sfmc_configure failed with error = %@",
                     error);
    }
    return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                          fallbackResource:nil];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[MarketingCloudSDK sharedInstance] sfmc_setDeviceToken:deviceToken];
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
    [[MarketingCloudSDK sharedInstance] sfmc_setNotificationRequest:response.notification.request];

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
    UNMutableNotificationContent *theSilentPushContent =
        [[UNMutableNotificationContent alloc] init];
    theSilentPushContent.userInfo = userInfo;
    UNNotificationRequest *theSilentPushRequest =
        [UNNotificationRequest requestWithIdentifier:[NSUUID UUID].UUIDString
                                             content:theSilentPushContent
                                             trigger:nil];

    [[MarketingCloudSDK sharedInstance] sfmc_setNotificationRequest:theSilentPushRequest];

    completionHandler(UIBackgroundFetchResultNewData);
}

@end
