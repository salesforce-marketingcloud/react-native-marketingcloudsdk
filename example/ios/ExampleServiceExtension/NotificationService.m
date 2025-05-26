// NotificationService.m
//
// Copyright (c) 2024 Salesforce, Inc
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


#import "NotificationService.h"

@implementation NotificationService

// Provide SFNotificationServiceConfig configuration
- (SFMCNotificationServiceConfig *)sfmcProvideConfig {
    SFMCExtensionSdkLogLevel logLevel = SFMCExtensionSdkLogLevelNone;
#if DEBUG
    logLevel = SFMCExtensionSdkLogLevelDebug;
#endif
    return [[SFMCNotificationServiceConfig alloc] initWithLogLevel: logLevel shouldShowCarouselThumbnail:YES];
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
