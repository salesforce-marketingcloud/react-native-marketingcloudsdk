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
#import <MarketingCloudSDK/MarketingCloudSDK.h>
#import "RCTConvert+SFMCEvent.h"
#import "InboxUtility.h"

const int LOG_LENGTH = 800;

@implementation RNSFMCSdk

- (instancetype)init {
    if (self = [super init]) {
        [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
            [mp addTag:@"React"];
        }];
    }
    return self;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_MODULE()

#pragma mark - Logging

- (void)log:(NSString *)msg {
    if (!self.logger) {
        self.logger = os_log_create("com.salesforce.marketingcloudsdk", "ReactNative");
    }
    os_log_info(self.logger, "%{public}@", msg);
}

- (void)splitLog:(NSString *)msg {
    NSInteger length = msg.length;
    for (int i = 0; i < length; i += LOG_LENGTH) {
        [self log:[msg substringWithRange:NSMakeRange(i, MIN(LOG_LENGTH, length - i))]];
    }
}

RCT_EXPORT_METHOD(logSdkState) {
    [self splitLog:[SFMCSdk state]];
}

#pragma mark - Push & Logging

RCT_EXPORT_METHOD(enableLogging) {
    [SFMCSdk setLoggerWithLogLevel:SFMCSdkLogLevelDebug logOutputter:[[SFMCSdkLogOutputter alloc] init]];
}

RCT_EXPORT_METHOD(disableLogging) {
    [SFMCSdk setLoggerWithLogLevel:SFMCSdkLogLevelFault logOutputter:[[SFMCSdkLogOutputter alloc] init]];
}

RCT_EXPORT_METHOD(enablePush) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [mp setPushEnabled:YES];
    }];
}

RCT_EXPORT_METHOD(disablePush) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [mp setPushEnabled:NO];
    }];
}

RCT_EXPORT_METHOD(isPushEnabled : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp pushEnabled]));
    }];
}

RCT_EXPORT_METHOD(getSystemToken : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve([mp deviceToken]);
    }];
}

RCT_EXPORT_METHOD(getDeviceId : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve([mp deviceIdentifier]);
    }];
}

RCT_EXPORT_METHOD(track : (NSDictionary* _Nonnull)eventJson) {
    [SFMCSdk trackWithEvent:[RCTConvert SFMCEvent:eventJson]];
}


#pragma mark - Contact & Attributes

RCT_EXPORT_METHOD(setContactKey : (NSString *)contactKey) {
    [[SFMCSdk identity] setProfileId:contactKey];
}

RCT_EXPORT_METHOD(getContactKey : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve([mp contactKey]);
    }];
}

RCT_EXPORT_METHOD(setAttribute : (NSString *)name value:(NSString *)value) {
    [[SFMCSdk identity] setProfileAttributes:@{name : value}];
}

RCT_EXPORT_METHOD(clearAttribute : (NSString *)name) {
    [[SFMCSdk identity] clearProfileAttributeWithKey:name];
}

RCT_EXPORT_METHOD(getAttributes : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve([mp attributes] ?: @[]);
    }];
}

#pragma mark - Tags

RCT_EXPORT_METHOD(addTag : (NSString *)tag) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [mp addTag:tag];
    }];
}

RCT_EXPORT_METHOD(removeTag : (NSString *)tag) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [mp removeTag:tag];
    }];
}

RCT_EXPORT_METHOD(getTags : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve([[mp tags] allObjects]);
    }];
}

#pragma mark - Analytics

RCT_EXPORT_METHOD(setAnalyticsEnabled : (BOOL)analyticsEnabled) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [mp setAnalyticsEnabled:analyticsEnabled];
    }];
}

RCT_EXPORT_METHOD(isAnalyticsEnabled : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp isAnalyticsEnabled]));
    }];
}

RCT_EXPORT_METHOD(setPiAnalyticsEnabled : (BOOL)analyticsEnabled) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [mp setPiAnalyticsEnabled:analyticsEnabled];
    }];
}

RCT_EXPORT_METHOD(isPiAnalyticsEnabled : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp isPiAnalyticsEnabled]));
    }];
}

#pragma mark - Inbox Messages

- (void)processAndResolveMessages:(NSArray<NSDictionary *> *)messages resolver:(RCTPromiseResolveBlock)resolve {
    if (messages.count == 0) {
        resolve(@[]);
        return;
    }
    InboxUtility *utility = [[InboxUtility alloc] init];
    resolve([utility processInboxMessages:messages]);
}

RCT_EXPORT_METHOD(getMessages : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [self processAndResolveMessages:[mp getAllMessages] resolver:resolve];
    }];
}

RCT_EXPORT_METHOD(getReadMessages : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [self processAndResolveMessages:[mp getReadMessages] resolver:resolve];
    }];
}

RCT_EXPORT_METHOD(getUnreadMessages : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [self processAndResolveMessages:[mp getUnreadMessages] resolver:resolve];
    }];
}

RCT_EXPORT_METHOD(getDeletedMessages : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        [self processAndResolveMessages:[mp getDeletedMessages] resolver:resolve];
    }];
}

RCT_EXPORT_METHOD(getMessageCount : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp getAllMessagesCount]));
    }];
}

RCT_EXPORT_METHOD(getReadMessageCount : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp getReadMessagesCount]));
    }];
}

RCT_EXPORT_METHOD(getUnreadMessageCount : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp getUnreadMessagesCount]));
    }];
}

RCT_EXPORT_METHOD(getDeletedMessageCount : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp getDeletedMessagesCount]));
    }];
}

RCT_EXPORT_METHOD(setMessageRead : (NSString* _Nonnull)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp markMessageWithIdReadWithMessageId:messageId]));
    }];
}

RCT_EXPORT_METHOD(deleteMessage : (NSString* _Nonnull)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp markMessageWithIdDeletedWithMessageId:messageId]));
    }];
}


RCT_EXPORT_METHOD(markAllMessagesRead : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp markAllMessagesRead]));
    }];
}

RCT_EXPORT_METHOD(markAllMessagesDeleted : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp markAllMessagesDeleted]));
    }];
}

RCT_EXPORT_METHOD(refreshInbox : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [SFMCSdk requestPushSdk:^(id<PushInterface> mp) {
        resolve(@([mp refreshMessages]));
    }];
}

#pragma mark - Event Listeners

RCT_EXPORT_METHOD(registerInboxResponseListener : (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onInboxResponseReceived:)
                                                 name:@"SFMCInboxMessagesMessageResponseSucceededNotification"
                                               object:nil];
    resolve(@(YES));
}

RCT_EXPORT_METHOD(unregisterInboxResponseListener) {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"SFMCInboxMessagesMessageResponseSucceededNotification" object:nil];
}

- (void)onInboxResponseReceived:(NSNotification *)notification {
    NSDictionary *userInfo = notification.userInfo;
    if (![userInfo isKindOfClass:[NSDictionary class]]) return;
    NSDictionary *responsePayload = userInfo[@"responsePayload"];
    NSArray<NSDictionary *> *messages = responsePayload[@"messages"];
    if (![messages isKindOfClass:[NSArray class]]) return;
    InboxUtility *utility = [[InboxUtility alloc] init];
    [self sendEventWithName:@"onInboxMessagesChanged" body:[utility processInboxMessages:messages]];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onInboxMessagesChanged"];
}

@end

