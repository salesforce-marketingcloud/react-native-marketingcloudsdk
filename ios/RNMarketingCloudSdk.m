
#import "RNMarketingCloudSdk.h"
#import <MarketingCloudSDK/MarketingCloudSDK.h>

const int LOG_LENGTH = 800;

@implementation RNMarketingCloudSdk

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (void)log:(NSString *)msg {
    if (@available(iOS 10, *)) {
        if (self.logger == nil) {
            self.logger =
            os_log_create("com.salesforce.marketingcloudsdk", "ReactNative");
        }
        os_log_info(self.logger, "%@", msg);
    } else {
        NSLog(@"%@", msg);
    }
}
- (void)splitLog:(NSString *)msg {
    NSInteger length = msg.length;
    for (int i = 0; i < length; i += LOG_LENGTH) {
        NSInteger rangeLength = MIN(length - i, LOG_LENGTH);
        [self log:[msg substringWithRange:NSMakeRange((NSUInteger)i, (NSUInteger)rangeLength)]];
    }
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(isPushEnabled:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_pushEnabled];
    resolve(@(status));
}

RCT_EXPORT_METHOD(enablePush) {
    [[MarketingCloudSDK sharedInstance] sfmc_setPushEnabled:YES];
}

RCT_EXPORT_METHOD(disablePush) {
    [[MarketingCloudSDK sharedInstance] sfmc_setPushEnabled:NO];
}

RCT_EXPORT_METHOD(getSystemToken:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *deviceToken = [[MarketingCloudSDK sharedInstance] sfmc_deviceToken];
    resolve(deviceToken);
}

RCT_EXPORT_METHOD(setContactKey:(NSString * _Nonnull)contactKey) {
    [[MarketingCloudSDK sharedInstance] sfmc_setContactKey:contactKey];
}

RCT_EXPORT_METHOD(getContactKey:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *contactKey = [[MarketingCloudSDK sharedInstance] sfmc_contactKey];
    resolve(contactKey);
}

RCT_EXPORT_METHOD(addTag:(NSString * _Nonnull)tag) {
    [[MarketingCloudSDK sharedInstance] sfmc_addTag:tag];
}

RCT_EXPORT_METHOD(removeTag:(NSString * _Nonnull)tag) {
    [[MarketingCloudSDK sharedInstance] sfmc_removeTag:tag];
}

RCT_EXPORT_METHOD(getTags:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSSet *tags = [[MarketingCloudSDK sharedInstance] sfmc_tags];
    NSArray *arr = [tags allObjects];
    resolve(arr);
}

RCT_EXPORT_METHOD(setAttribute:(NSString * _Nonnull)name
                 value:(NSString * _Nonnull)value) {
    [[MarketingCloudSDK sharedInstance] sfmc_setAttributeNamed:name value:value];
}

RCT_EXPORT_METHOD(clearAttribute:(NSString * _Nonnull)name){
    [[MarketingCloudSDK sharedInstance] sfmc_clearAttributeNamed:name];
}

RCT_EXPORT_METHOD(getAttributes:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary *attributes = [[MarketingCloudSDK sharedInstance] sfmc_attributes];
    resolve((attributes != nil) ? attributes : @[]);
}

RCT_EXPORT_METHOD(enableVerboseLogging) {
    [[MarketingCloudSDK sharedInstance] sfmc_setDebugLoggingEnabled:YES];
}

RCT_EXPORT_METHOD(disableVerboseLogging) {
    [[MarketingCloudSDK sharedInstance] sfmc_setDebugLoggingEnabled:NO];
}

RCT_EXPORT_METHOD(logSdkState) {
    [self splitLog:[[MarketingCloudSDK sharedInstance] sfmc_getSDKState]];
}

@end
