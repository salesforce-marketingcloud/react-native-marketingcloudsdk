// RNSFMCInboxModule.m
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


#import "RNSFMCInboxModule.h"
#import <SFMCSDK/SFMCSDK.h>
#import <MarketingCloudSDK/MarketingCloudSDK.h>
#import "InboxMessagingUtility.h"

@implementation RNSFMCInboxModule

- (BOOL)isSdkNotInitialized: (RCTPromiseRejectBlock)reject {
    if ([[SFMCSdk mp] getStatus] != SFMCSdkModuleStatusOperational) {
        reject(@"SFMC_SDK_ERROR", @"IS_NOT_INITIALIZED", nil);
        return true;
    }
    return false;
}

- (BOOL)isSdkNotInitialized {
    if ([[SFMCSdk mp] getStatus] != SFMCSdkModuleStatusOperational) {
        return true;
    }
    return false;
}

RCT_EXPORT_METHOD(deleteMessage:(NSString*)messageId)
{
    if([self isSdkNotInitialized]) return;
    BOOL _result = [[SFMCSdk mp] markMessageWithIdDeletedWithMessageId:messageId];
}

RCT_EXPORT_METHOD(getDeletedMessageCount:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    BOOL result = [[SFMCSdk mp] getDeletedMessagesCount];
    resolve(@(result));
}

RCT_EXPORT_METHOD(getDeletedMessages: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    NSArray* messages = [[SFMCSdk mp] getDeletedMessages];
    NSArray* result = [InboxMessagingUtility mapInboxMessages:messages];
    
    resolve(result);
}


RCT_EXPORT_METHOD(getMessages: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    NSArray* messages = [[SFMCSdk mp] getAllMessages];
    NSArray* result = [InboxMessagingUtility mapInboxMessages:messages];
    
    resolve(result);
}


RCT_EXPORT_METHOD(getMessageCount: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    long count = [[SFMCSdk mp] getAllMessagesCount];
    resolve(@(count));
}

RCT_EXPORT_METHOD(getReadMessageCount: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    long count = [[SFMCSdk mp] getReadMessagesCount];
    resolve(@(count));
}

RCT_EXPORT_METHOD(getReadMessages: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    NSArray* messages = [[SFMCSdk mp] getReadMessages];
    NSArray* result = [InboxMessagingUtility mapInboxMessages:messages];
    
    resolve(result);
}

RCT_EXPORT_METHOD(getUnreadMessageCount: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    long count = [[SFMCSdk mp] getUnreadMessagesCount];
    resolve(@(count));
}

RCT_EXPORT_METHOD(getUnreadMessages: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    NSArray* messages = [[SFMCSdk mp] getUnreadMessages];
    NSArray* result = [InboxMessagingUtility mapInboxMessages:messages];
    
    resolve(result);
}

RCT_EXPORT_METHOD(markAllMessagesDeleted: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    BOOL result = [[SFMCSdk mp] markAllMessagesDeleted];
    resolve(@(result));
}

RCT_EXPORT_METHOD(markAllMessagesRead: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    BOOL result = [[SFMCSdk mp] markAllMessagesRead];
    resolve(@(result));
}

RCT_EXPORT_METHOD(refreshInbox: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    BOOL result = [[SFMCSdk mp] refreshMessages];
    resolve(@(result));
}

RCT_EXPORT_METHOD(setMessageRead:(NSString*)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self isSdkNotInitialized: reject]) return;
    BOOL result = [[SFMCSdk mp] markMessageWithIdReadWithMessageId:messageId];
    resolve(@(result));
}

-(void)startObserving {
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(onRefresh:)
     name: SFMCInboxMessagesRefreshCompleteNotification
     object:nil];
}

-(void)stopObserving {
    [[NSNotificationCenter defaultCenter]
     removeObserver:self
     name:SFMCInboxMessagesRefreshCompleteNotification
     object:nil];
}


- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onInboxMessagesChanged"];
}

- (void)onRefresh:(NSNotification *)notification {
    NSArray* messages = [[SFMCSdk mp] getAllMessages];
    NSArray* result = [InboxMessagingUtility mapInboxMessages:messages];
    
    [self sendEventWithName: @"onInboxMessagesChanged" body:result];
}


+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_MODULE()

@end
