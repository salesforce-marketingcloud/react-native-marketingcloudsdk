//
//  NotificationViewController.m
//  ExampleContentExtension
//
//  Created by Sunny Agarwal on 29/04/25.
//

#import "NotificationViewController.h"

@implementation NotificationViewController

- (SFMCContentExtensionConfig *)sfmcProvideConfig {
    SFMCExtensionSdkLogLevel logLevel = SFMCExtensionSdkLogLevelNone;
#if DEBUG
    logLevel = SFMCExtensionSdkLogLevelDebug;
#endif
    return [[SFMCContentExtensionConfig alloc] initWithLogLevel:logLevel timeoutIntervalForRequest:30.0];
}

@end
