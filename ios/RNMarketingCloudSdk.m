
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

RCT_REMAP_METHOD(isPushEnabled,
                 isPushEnabledResolver:(RCTPromiseResolveBlock)resolve
                 isPushEnabledRejecter:(RCTPromiseRejectBlock)reject) {
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_pushEnabled];
    resolve(@(status));
}

RCT_REMAP_METHOD(enablePush,
                 enablePushResolver:(RCTPromiseResolveBlock)resolve
                 enablePushRejecter:(RCTPromiseRejectBlock)reject) {
    [[MarketingCloudSDK sharedInstance] sfmc_setPushEnabled:YES];
    resolve(@(YES));
}

RCT_REMAP_METHOD(disablePush,
                 disablePushResolver:(RCTPromiseResolveBlock)resolve
                 disablePushRejecter:(RCTPromiseRejectBlock)reject) {
    [[MarketingCloudSDK sharedInstance] sfmc_setPushEnabled:NO];
    resolve(@(YES));
}

RCT_REMAP_METHOD(getSystemToken,
                 tokenResolver:(RCTPromiseResolveBlock)resolve
                 tokenRejecter:(RCTPromiseRejectBlock)reject) {
    NSString *deviceToken = [[MarketingCloudSDK sharedInstance] sfmc_deviceToken];
    resolve(deviceToken);
}

RCT_REMAP_METHOD(setContactKey,
                 contactKey:(NSString * _Nonnull)contactKey
                 contactResolver:(RCTPromiseResolveBlock)resolve
                 contactRejecter:(RCTPromiseRejectBlock)reject) {
    
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_setContactKey:contactKey];
    resolve(@(status));
}

RCT_REMAP_METHOD(getContactKey,
                 contactResolver:(RCTPromiseResolveBlock)resolve
                 contactRejecter:(RCTPromiseRejectBlock)reject) {
    NSString *contactKey = [[MarketingCloudSDK sharedInstance] sfmc_contactKey];
    resolve(contactKey);
}

RCT_REMAP_METHOD(addTag,
                 addTag:(NSString * _Nonnull)tag
                 tagResolver:(RCTPromiseResolveBlock)resolve
                 tagRejecter:(RCTPromiseRejectBlock)reject) {
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_addTag:tag];
    resolve(@(status));
}

RCT_REMAP_METHOD(removeTag,
                 removeTag:(NSString * _Nonnull)tag
                 tagResolver:(RCTPromiseResolveBlock)resolve
                 tagRejecter:(RCTPromiseRejectBlock)reject) {
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_removeTag:tag];
    resolve(@(status));
}

RCT_REMAP_METHOD(getTags,
                 tagResolver:(RCTPromiseResolveBlock)resolve
                 tagRejecter:(RCTPromiseRejectBlock)reject) {
    NSSet *tags = [[MarketingCloudSDK sharedInstance] sfmc_tags];
    NSArray *arr = [tags allObjects];
    resolve(arr);
}

RCT_REMAP_METHOD(setAttribute,
                 named:(NSString * _Nonnull)name
                 value:(NSString * _Nonnull)value
                 attributeResolver:(RCTPromiseResolveBlock)resolve
                 attributeRejecter:(RCTPromiseRejectBlock)reject) {
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_setAttributeNamed:name value:value];
    resolve(@(status));
}

RCT_REMAP_METHOD(clearAttribute,
                 named:(NSString * _Nonnull)name
                 attributeResolver:(RCTPromiseResolveBlock)resolve
                 attributeRejecter:(RCTPromiseRejectBlock)reject) {
    BOOL status = [[MarketingCloudSDK sharedInstance] sfmc_clearAttributeNamed:name];
    resolve(@(status));
}

RCT_REMAP_METHOD(getAttributes,
                 attributeResolver:(RCTPromiseResolveBlock)resolve
                 attributeRejecter:(RCTPromiseRejectBlock)reject) {
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
