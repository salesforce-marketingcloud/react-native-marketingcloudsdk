#import "InboxUtility.h"

@implementation InboxUtility

- (NSMutableArray<NSDictionary *> *)processInboxMessages:(NSArray<NSDictionary *> *)inboxMessages {
    NSMutableArray<NSDictionary *> *updatedMessages = [NSMutableArray array];

    for (NSDictionary *message in inboxMessages) {
        NSMutableDictionary *updatedMessage = [message mutableCopy];
        [self convertDatesInMessage:updatedMessage];
        [self convertFlagsInMessage:updatedMessage];
        [self convertCustomObjectInMessage:updatedMessage];
        [self convertNotificationMessageObjectInMessage:updatedMessage];
        [updatedMessages addObject:updatedMessage];
    }

    return updatedMessages;
}

- (NSString *)convertDictionaryToJSONString:(NSDictionary *)dictionary {
    NSError *jsonError;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:&jsonError];
    if (jsonData) {
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    } else {
        NSLog(@"Error converting dictionary to JSON string: %@", jsonError.localizedDescription);
        return nil;
    }
}

- (void)convertDatesInMessage:(NSMutableDictionary *)message {
    [self convertDateField:@"startDateUtc" inMessage:message];
    [self convertDateField:@"sendDateUtc" inMessage:message];
    [self convertDateField:@"endDateUtc" inMessage:message];
}

- (void)convertDateField:(NSString *)field inMessage:(NSMutableDictionary *)message {
    if ([message[field] isKindOfClass:[NSDate class]]) {
        NSDate *date = message[field];
        NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
        dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss";
        NSString *dateString = [dateFormatter stringFromDate:date];
        message[field] = dateString;
    }
}

- (void)convertFlagsInMessage:(NSMutableDictionary *)message {
    message[@"deleted"] = @([message[@"deleted"] boolValue]);
    message[@"read"] = @([message[@"read"] boolValue]);
}

- (void)convertCustomObjectInMessage:(NSMutableDictionary *)message {
    id customObject = message[@"custom"];
    if (!customObject || customObject == [NSNull null]) {
        customObject = @{};
    }

    if ([customObject isKindOfClass:[NSDictionary class]]) {
        NSError *jsonError;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:customObject options:NSJSONWritingPrettyPrinted error:&jsonError];
        if (jsonData) {
            NSString *customString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            message[@"custom"] = customString;
        } else {
            NSLog(@"Error converting custom dictionary to JSON string: %@",
                  jsonError.localizedDescription);
            message[@"custom"] = @"";
        }
    } else {
        NSLog(@"Custom data is not a valid NSDictionary object");
        message[@"custom"] = @"";
    }
}

- (void)convertNotificationMessageObjectInMessage:(NSMutableDictionary *)message {
    id notificationMessageObject = message[@"notificationMessage"];
    if (!notificationMessageObject || notificationMessageObject == [NSNull null]) {
        notificationMessageObject = @{};
    }
    NSString* notificationString = [self convertDictionaryToJSONString: notificationMessageObject];
    if ([notificationString length] > 0) {
        message[@"notificationMessage"] = notificationString;
    } else {
        NSLog(@"Notification Message data is not a valid NSDictionary object");
        message[@"notificationMessage"] = @"";
    }
}

@end
