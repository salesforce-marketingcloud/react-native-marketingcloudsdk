/**
 * @license
 * Copyright 2023 Salesforce, Inc
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/com.salesforce.marketingcloud.sfmcsdk.components.events/-event/-category/index.html|Android Docs}
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Enums/EventCategory.html|iOS Docs}
 */
export enum EventCategory {
  ENGAGEMENT = "engagement",
  IDENTITY = "identity",
  SYSTEM = "system",
}

/**
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/com.salesforce.marketingcloud.sfmcsdk.components.events/-event-manager/custom-event.html|Android Docs}
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/CustomEvent.html|iOS Docs}
 */
export class CustomEvent {
  category: EventCategory;
  name: string;
  attributes?: { [x: string]: string };

  constructor(
    name: string,
    attributes?: { [x: string]: string },
    category?: EventCategory
  );
}

/**
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/EngagementEvent.html|iOS Docs}
 */
export class EngagementEvent extends CustomEvent {
  constructor(name: string, attributes?: { [x: string]: string });
}

/**
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SystemEvent.html|iOS Docs}
 */
export class SystemEvent extends CustomEvent {
  constructor(name: string, attributes?: { [x: string]: string });
}

export class IdentityEvent extends CustomEvent {
  attributes?: { [x: string]: string };
  profileAttributes?: { [x: string]: string };
  profileId?: string;

  private constructor()
  static attributes(attributes: {
    [x: string]: string;
  }): IdentityEvent;
  static profileAttributes(profileAttributes: {
    [x: string]: string;
  }): IdentityEvent;
  static profileId(profileId: string): IdentityEvent;
}

export enum CartEventType {
  ADD = "Add To Cart",
  REMOVE = "Remove From Cart",
  REPLACE = "Replace Cart",
}

export class CartEvent extends EngagementEvent {
  lineItems: LineItem[];
  private constructor(name: CartEventType, lineItems: LineItem[]);
  static addToCart(lineItem: LineItem): CartEvent;
  static removeFromCart(lineItem: LineItem): CartEvent;
  static replaceCart(lineItems: LineItem[]): CartEvent;
}

export enum CatalogObjectEventName {
  COMMENT = "Comment Catalog Object",
  DETAIL = "View Catalog Object Detail",
  FAVORITE = "Favorite Catalog Object",
  SHARE = "Share Catalog Object",
  REVIEW = "Review Catalog Object",
  VIEW = "View Catalog Object",
  QUICK_VIEW = "Quick View Catalog Object",
}

export class CatalogObjectEvent extends EngagementEvent {
  catalogObject: CatalogObject;
  private constructor(name: CatalogObjectEventName, catalogObject: CatalogObject);
  static commentCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
  static detailCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
  static favoriteCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
  static shareCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
  static reviewCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
  static viewCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
  static quickViewCatalog(catalogObject: CatalogObject): CatalogObjectEvent;
}

export enum OrderEventName {
  CANCEL = "Cancel",
  DELIVER = "Deliver",
  EXCHANGE = "Exchange",
  PREORDER = "Preorder",
  PURCHASE = "Purchase",
  RETURN = "Return",
  SHIP = "Ship",
}

export class OrderEvent extends EngagementEvent {
  private constructor(name: OrderEventName, order: Order);

  static purchase(order: Order): OrderEvent;
  static preorder(order: Order): OrderEvent;
  static cancel(order: Order): OrderEvent;
  static ship(order: Order): OrderEvent;
  static deliver(order: Order): OrderEvent;
  static returnOrder(order: Order): OrderEvent;
  static exchange(order: Order): OrderEvent;
}

export class CatalogObject {
  type: string;
  id: string;
  attributes: { [x: string]: string };
  relatedCatalogObjects: { [x: string]: string[] };

  constructor(
    type: string,
    id: string,
    attributes: { [x: string]: string },
    relatedCatalogObjects: { [x: string]: string[] }
  );
}

export class LineItem {
  catalogObjectType: string;
  catalogObjectId: string;
  quantity: number;
  price: number;
  currency: string;
  attributes: { [x: string]: string };

  constructor(
    catalogObjectType: string,
    catalogObjectId: string,
    quantity: number,
    price?: number,
    currency?: string,
    attributes?: { [x: string]: string }
  );
}

export class Order {
  id: string;
  lineItems: LineItem[];
  totalValue?: number;
  currency?: string;
  attributes?: { [x: string]: string };

  constructor(
    id: string,
    lineItems: LineItem[],
    totalValue?: number | null,
    currency?: string | null,
    attributes?: { [x: string]: string }
  );
}

export type Event =
  | CustomEvent
  | EngagementEvent
  | IdentityEvent
  | SystemEvent
  | CartEvent
  | OrderEvent
  | CatalogObjectEvent;
