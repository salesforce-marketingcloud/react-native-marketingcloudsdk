// RNSFMCSdk.m
//
// Copyright (c) 2023 Salesforce, Inc
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

#import "RNSFMCSdk.h"
#import <SFMCSDK/SFMCSDK.h>
#import <MarketingCloudSDK/MarketingCloudSDK.h>
#import "RCTConvert+SFMCEvent.h"

const int LOG_LENGTH = 800;

@implementation RNSFMCSdk

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

- (void)log:(NSString *)msg {
    if (self.logger == nil) {
        self.logger = os_log_create("com.salesforce.marketingcloudsdk", "ReactNative");
    }
    os_log_info(self.logger, "%{public}@", msg);
}
- (void)splitLog:(NSString *)msg {
    NSInteger length = msg.length;
    for (int i = 0; i < length; i += LOG_LENGTH) {
        NSInteger rangeLength = MIN(length - i, LOG_LENGTH);
        [self log:[msg substringWithRange:NSMakeRange((NSUInteger)i, (NSUInteger)rangeLength)]];
    }
}

RCT_EXPORT_METHOD(logSdkState) {
    [self splitLog:[SFMCSdk state]];
}

RCT_EXPORT_METHOD(getSystemToken
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    NSString *deviceToken = [[SFMCSdk mp] deviceToken];
    resolve(deviceToken);
}

RCT_EXPORT_METHOD(enableLogging) {
    [SFMCSdk setLoggerWithLogLevel:SFMCSdkLogLevelDebug logOutputter:[[SFMCSdkLogOutputter alloc] init]];
}

RCT_EXPORT_METHOD(disableLogging) {
    [SFMCSdk setLoggerWithLogLevel:SFMCSdkLogLevelFault logOutputter:[[SFMCSdkLogOutputter alloc] init]];
}

RCT_EXPORT_METHOD(enablePush) { [[SFMCSdk mp] setPushEnabled:YES]; }

RCT_EXPORT_METHOD(disablePush) { [[SFMCSdk mp] setPushEnabled:NO]; }

RCT_EXPORT_METHOD(isPushEnabled
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    BOOL status =  [[SFMCSdk mp] pushEnabled];
    resolve(@(status));
}

RCT_EXPORT_METHOD(getDeviceId
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    NSString *deviceId = [[SFMCSdk mp] deviceIdentifier];
    resolve(deviceId);
}

RCT_EXPORT_METHOD(track:(NSDictionary* _Nonnull)eventJson) {
    [SFMCSdk trackWithEvent:[RCTConvert SFMCEvent:eventJson]];
}

RCT_EXPORT_METHOD(setContactKey : (NSString* _Nonnull)contactKey) {
    [[SFMCSdk identity] setProfileId:contactKey];
}

RCT_EXPORT_METHOD(getContactKey
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    NSString *contactKey = [[SFMCSdk mp] contactKey];
    resolve(contactKey);
}

RCT_EXPORT_METHOD(addTag : (NSString* _Nonnull)tag) {
    [[SFMCSdk mp] addTag:tag];
}

RCT_EXPORT_METHOD(removeTag : (NSString* _Nonnull)tag) {
    [[SFMCSdk mp] removeTag:tag];
}

RCT_EXPORT_METHOD(getTags
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    NSArray *tags = [[[SFMCSdk mp] tags] allObjects];
    resolve(tags);
}

RCT_EXPORT_METHOD(setAttribute : (NSString* _Nonnull)name value : (NSString* _Nonnull)value) {
    [[SFMCSdk identity] setProfileAttributes:@{name: value}];
}

RCT_EXPORT_METHOD(clearAttribute : (NSString* _Nonnull)name) {
    [[SFMCSdk identity] clearProfileAttributeWithKey:name];
}

RCT_EXPORT_METHOD(getAttributes
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    NSDictionary *attributes = [[SFMCSdk mp] attributes];
    resolve((attributes != nil) ? attributes : @[]);
}


RCT_EXPORT_METHOD(setAnalyticsEnabled : (BOOL)analyticsEnabled) {
    [[SFMCSdk mp] setAnalyticsEnabled:analyticsEnabled];
}

RCT_EXPORT_METHOD(isAnalyticsEnabled
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    BOOL isEnabled = [[SFMCSdk mp] isAnalyticsEnabled];
    resolve(@(isEnabled));
}

// PI Analytics Enablement
RCT_EXPORT_METHOD(setPiAnalyticsEnabled : (BOOL)analyticsEnabled) {
    [[SFMCSdk mp] setPiAnalyticsEnabled:analyticsEnabled];
}

RCT_EXPORT_METHOD(isPiAnalyticsEnabled
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
    BOOL isEnabled = [[SFMCSdk mp] isPiAnalyticsEnabled];
    resolve(@(isEnabled));
}

@end
