
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <os/log.h>

@interface RNMarketingCloudSdk : NSObject <RCTBridgeModule>
@property(nonatomic, strong) os_log_t logger;

@end

