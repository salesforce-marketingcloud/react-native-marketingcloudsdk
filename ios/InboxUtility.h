#import <Foundation/Foundation.h>

@interface InboxUtility : NSObject

- (NSMutableArray<NSDictionary *> *)processInboxMessages:(NSArray<NSDictionary *> *)inboxMessages;
- (NSString *)convertDictionaryToJSONString:(NSDictionary *)dictionary;

@end
