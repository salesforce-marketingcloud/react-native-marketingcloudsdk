// RCTConvert+SFMCEvent.m
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

#import "RCTConvert+SFMCEvent.h"

@implementation RCTConvert (SFMCEvent)

+ (id<SFMCSdkEvent>)SFMCEvent: (NSDictionary *)eventJson {
    NSDictionary *json = [self removeNulls:[RCTConvert NSDictionary:eventJson]];
    NSString *objType = [RCTConvert NSString:json[@"objType"]];
    NSString *name = [RCTConvert NSString:json[@"name"]];
    if ([objType isEqualToString:@"CartEvent"] ) {
        if ([name isEqualToString:@"Replace Cart"]) {
            return [[SFMCSdkReplaceCartEvent alloc] initWithLineItems:[RCTConvert LineItems:json[@"lineItems"]]];
        } else {
            return [[[self eventClassFromName:json] alloc] initWithLineItem:[[RCTConvert LineItems:json[@"lineItems"]] lastObject]];
        }
    } else if ([objType isEqualToString:@"CatalogObjectEvent"] ) {
        return [[[self eventClassFromName:json]  alloc] initWithCatalogObject:[RCTConvert CatalogObject:json[@"catalogObject"]]];
    } else if ([objType isEqualToString:@"OrderEvent"]) {
        return [[[self eventClassFromName:json]  alloc] initWithOrder:[RCTConvert Order:json[@"order"]]];
    } else if ([objType isEqualToString:@"CustomEvent"]) {
        return [[SFMCSdkCustomEvent  alloc]
                initWithName:[RCTConvert NSString:json[@"name"]]
                attributes:[RCTConvert NSDictionary:json[@"attributes"]]];
    } else if ([name isEqualToString:@"IdentityEvent"]) {
        if (json[@"profileId"] != nil) {
            return [[SFMCSdkIdentityEvent alloc] initWithProfileId:[RCTConvert NSString:json[@"profileId"]]];
        } else if (json[@"profileAttributes"] != nil) {
            return [[SFMCSdkIdentityEvent alloc] initWithProfileAttributes:[RCTConvert NSDictionary:json[@"profileAttributes"]]];
        } else if (json[@"attributes"] != nil) {
            return [[SFMCSdkIdentityEvent alloc] initWithAttributes:[RCTConvert NSDictionary:json[@"attributes"]]];
        }
    } else if (json[@"category"] != nil) {
        return [[[self eventClassFromCategory:json] alloc]
                initWithName:[RCTConvert NSString:json[@"name"]]
                attributes:[RCTConvert NSDictionary:json[@"attributes"]]];
    }
    return nil;
}

+ (SFMCSdkLineItem *)LineItem:(NSDictionary *)eventJson {
    NSDictionary *json = [self removeNulls:[RCTConvert NSDictionary:eventJson]];
    if ([json[@"objType"] isEqualToString:@"LineItem"]) {
        return [[SFMCSdkLineItem alloc]
                initWithCatalogObjectType:[RCTConvert NSString:json[@"catalogObjectType"]]
                catalogObjectId:[RCTConvert NSString:json[@"catalogObjectId"]]
                quantity:[RCTConvert NSInteger:json[@"quantity"]]
                price:[NSDecimalNumber decimalNumberWithDecimal:[[RCTConvert NSNumber:json[@"price"]] decimalValue]]
                currency:[RCTConvert NSString:json[@"currency"]]
                attributes:[RCTConvert NSDictionary:json[@"attributes"]]];
    }
    return nil;
}


+ (SFMCSdkCatalogObject *)CatalogObject:(NSDictionary *)eventJson {
    NSDictionary *json = [self removeNulls:[RCTConvert NSDictionary:eventJson]];
    if ([json[@"objType"] isEqualToString:@"CatalogObject"]) {
        return [[SFMCSdkCatalogObject alloc]
                initWithType:[RCTConvert NSString:json[@"type"]]
                id:[RCTConvert NSString:json[@"id"]]
                attributes:[RCTConvert NSDictionary:json[@"attributes"]]
                relatedCatalogObjects:[RCTConvert NSDictionary:json[@"relatedCatalogObjects"]]];
    }
    return nil;
}


+ (SFMCSdkOrder *)Order:(NSDictionary *)eventJson {
    NSDictionary *json = [self removeNulls:[RCTConvert NSDictionary:eventJson]];
    if ([json[@"objType"] isEqualToString:@"Order"]) {
        NSArray *lineItems = [RCTConvert LineItems:json[@"lineItems"]];
        return [[SFMCSdkOrder alloc]
         initWithId:[RCTConvert NSString:json[@"id"]]
         lineItems:lineItems
         totalValue:[NSDecimalNumber decimalNumberWithDecimal:[[RCTConvert NSNumber:json[@"totalValue"]] decimalValue]]
         currency:[RCTConvert NSString:json[@"currency"]]
         attributes:[RCTConvert NSDictionary:json[@"attributes"]]];
    }
    return nil;
}

+ (NSArray *)LineItems:(NSArray *)lineItemsJson {
    NSMutableArray *lineItems = [NSMutableArray array];

    for (NSDictionary *dict in [RCTConvert NSArray:lineItemsJson]) {
        NSDictionary *lineItemJson = [self removeNulls:[RCTConvert NSDictionary:dict]];

        SFMCSdkLineItem *lineItem = [RCTConvert LineItem:lineItemJson];
        if (lineItem != nil) {
            [lineItems addObject:lineItem];
        }
    }
    return lineItems;
}

+ (Class)eventClassFromName:(NSDictionary *)json {
    NSDictionary *SFMCSdkEventType =  @{
        @"CartEvent": [SFMCSdkCartEvent class],
        @"Add To Cart": [SFMCSdkAddToCartEvent class],
        @"Remove From Cart": [SFMCSdkRemoveFromCartEvent class],
        @"Replace Cart": [SFMCSdkReplaceCartEvent class],
        @"Comment Catalog Object": [SFMCSdkCommentCatalogObjectEvent class],
        @"View Catalog Object Detail": [SFMCSdkViewCatalogObjectDetailEvent class],
        @"Favorite Catalog Object": [SFMCSdkFavoriteCatalogObjectEvent class],
        @"Share Catalog Object": [SFMCSdkShareCatalogObjectEvent class],
        @"Review Catalog Object": [SFMCSdkReviewCatalogObjectEvent class],
        @"View Catalog Object": [SFMCSdkViewCatalogObjectEvent class],
        @"Quick View Catalog Object": [SFMCSdkQuickViewCatalogObjectEvent class],
        @"Cancel": [SFMCSdkCancelOrderEvent class],
        @"Deliver": [SFMCSdkDeliverOrderEvent class],
        @"Exchange": [SFMCSdkExchangeOrderEvent class],
        @"Preorder": [SFMCSdkPreorderEvent class],
        @"Purchase": [SFMCSdkPurchaseOrderEvent class],
        @"Return": [SFMCSdkReturnOrderEvent class],
        @"Ship": [SFMCSdkShipOrderEvent class]
    };
    NSString *eventName = [RCTConvert NSString:json[@"name"]];
    return SFMCSdkEventType[eventName];
}

+ (Class)eventClassFromCategory:(NSDictionary *)json {
    NSDictionary *SFMCSdkEventType =  @{
        @"engagement": [SFMCSdkCustomEvent class],
        @"system": [SFMCSdkSystemEvent class],
        @"identity": [SFMCSdkIdentityEvent class]

    };
    NSString *eventName = [RCTConvert NSString:json[@"category"]];
    return SFMCSdkEventType[eventName];
}


+ (id)removeNulls:(id)jsonObject {
    if ([jsonObject isKindOfClass:[NSArray class]]) {
        NSMutableArray *array = [jsonObject mutableCopy];
        for (long i = array.count - 1; i >= 0; i--) {
            id val = array[i];
            if ([val isKindOfClass:[NSNull class]]){
                [array removeObjectAtIndex:i];
            } else {
                array[i] = [self removeNulls:val];
            }
        }
        return array;
    } else if ([jsonObject isKindOfClass:[NSDictionary class]]) {
        NSMutableDictionary *dictionary = [jsonObject mutableCopy];
        for(NSString *key in [dictionary allKeys]) {
            id val = dictionary[key];
            if ([val isKindOfClass:[NSNull class]]){
                [dictionary removeObjectForKey:key];
            } else {
                dictionary[key] = [self removeNulls:val];
            }
        }
        return dictionary;
    } else {
        return jsonObject;
    }
}

@end
