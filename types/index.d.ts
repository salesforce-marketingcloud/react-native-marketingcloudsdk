export default MCReactModule;
/**
 * @license
 * Copyright 2019 Salesforce, Inc
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
 * @class MCReactModule
 */

import { Event } from "./event";

export interface InboxMessageMedia {
  altText?: string | null;
  url?: string | null;
}

export interface InboxNotificationMessage {
  id: string;
  alert: string;
  sound: string;
  type: string;
  trigger: string;
  soundName?: string | null;
  title?: string | null;
  subtitle?: string | null;
  url?: string | null;
  mediaUrl?: string | null;
  mediaAltText?: string | null;
  customKeys?: Record<string, string>;
  custom?: string | null;
  payload?: Record<string, string>;
}

export interface InboxMessage {
  id: string;
  subject?: string | null;
  title?: string | null;
  alert?: string | null;
  sound?: string | null;
  read: boolean;
  deleted: boolean;
  media?: InboxMessageMedia | null;
  startDateUtc?: string | null;
  sendDateUtc?: string | null;
  endDateUtc?: string | null;
  custom?: string | null;
  keys?: Record<string, string>;
  calculatedType?: string | null;
  messageType?: string | null;
  url?: string | null;
  subtitle?: string | null;
  inboxMessage?: string | null;
  inboxSubtitle?: string | null;
  notificationMessage?: InboxNotificationMessage | string;
}

declare class MCReactModule {
  /**
   * The current state of the pushEnabled flag in the native Marketing Cloud
   * SDK.
   * @returns {Promise<boolean>} A promise to the boolean representation of whether push is
   *     enabled.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/is-push-enabled.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)pushEnabled|iOS Docs}
   */
  static isPushEnabled(): Promise<boolean>;
  /**
   * Enables push messaging in the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/enable-push.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)setPushEnabled:|iOS Docs}
   */
  static enablePush(): void;
  /**
   * Disables push messaging in the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/disable-push.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)setPushEnabled:|iOS Docs}
   */
  static disablePush(): void;
  /**
   * Returns the token used by the Marketing Cloud to send push messages to
   * the device.
   * @returns {Promise<?string>} A promise to the system token string.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-system-token.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)deviceToken|iOS Docs}
   */
  static getSystemToken(): Promise<string | null>;
  /**
   * Returns the maps of attributes set in the registration.
   * @returns {Promise<Object.<string, string>>} A promise to the key/value map of attributes set
   *     in the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-attributes.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)attributes|iOS Docs}
   */
  static getAttributes(): Promise<{
    [x: string]: string;
  }>;
  /**
   * Sets the value of an attribute in the registration.
   * @param  {string} key - The name of the attribute to be set in the
   *     registration.
   * @param  {string} value - The value of the `key` attribute to be set in
   *     the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/com.salesforce.marketingcloud.sfmcsdk.components.identity/-identity/set-profile-attribute.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)setProfileAttributes:|iOS Docs}
   */
  static setAttribute(key: string, value: string): void;
  /**
   * Clears the value of an attribute in the registration.
   * @param  {string} key - The name of the attribute whose value should be
   *     cleared from the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/-editor/clear-attribute.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)clearProfileAttributeWithKey:|iOS Docs}
   */
  static clearAttribute(key: string): void;
  /**
   * @param  {string} tag - The tag to be added to the list of tags in the
   *     registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/-editor/add-tag.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)addTag:|iOS Docs}
   */
  static addTag(tag: string): void;
  /**
   * @param  {string} tag - The tag to be removed from the list of tags in the
   *     registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/-editor/remove-tag.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)removeTag:|iOS Docs}
   */
  static removeTag(tag: string): void;
  /**
   * Returns the tags currently set on the device.
   * @returns  {Promise<string[]>} A promise to the array of tags currently set in the native SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-tags.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)tags|iOS Docs}
   */
  static getTags(): Promise<string[]>;
  /**
   * Sets the contact key for the device's user.
   * @param  {string} contactKey - The value to be set as the contact key of
   *     the device's user.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/com.salesforce.marketingcloud.sfmcsdk.components.identity/-identity/set-profile-id.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)setProfileId:|iOS Docs}
   */
  static setContactKey(contactKey: string): void;
  /**
   * Returns the contact key currently set on the device.
   * @returns  {Promise<?string>} A promise to the current contact key.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-contact-key.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)contactKey|iOS Docs}
   */
  static getContactKey(): Promise<string | null>;
  /**
   * Enables verbose logging within the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/trouble-shooting/loginterface.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SFMCSdk.html#/c:@M@SFMCSDK@objc(cs)SFMCSdk(cm)setLoggerWithLogLevel:logOutputter:|iOS Docs}
   */
  static enableLogging(): void;
  /**
   * Disables verbose logging within the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/trouble-shooting/loginterface.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SFMCSdk.html#/c:@M@SFMCSDK@objc(cs)SFMCSdk(cm)setLoggerWithLogLevel:logOutputter:|iOS Docs}
   */
  static disableLogging(): void;
  /**
   * Instructs the native SDK to log the SDK state to the native logging system (Logcat for
   * Android and Xcode/Console.app for iOS).  This content can help diagnose most issues within
   * the SDK and will be requested by the Marketing Cloud support team.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/SFMCSdk/8.0/com.salesforce.marketingcloud.sfmcsdk/-s-f-m-c-sdk/get-sdk-state.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SFMCSdk.html#/c:@M@SFMCSDK@objc(cs)SFMCSdk(cm)state|iOS Docs}
   */
  static logSdkState(): void;
  /**
   * This method helps to track events, which could result in actions such as an InApp Message being displayed.
   *
   * @param {CustomEvent | EngagementEvent | IdentityEvent | SystemEvent | CartEvent | OrderEvent | CatalogObjectEvent} event - The event to be tracked.
   *
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/event-tracking/event-tracking-event-tracking.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/event-tracking/event-tracking-event-tracking.html |iOS Docs}
   */
  static track(event: Event): void;
  /**
   * Returns the deviceId used by the Marketing Cloud to send push messages to the device.
   * @returns {Promise<?string>} A promise to the device Id.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-device-id.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)deviceIdentifier|iOS Docs}
   */
  static getDeviceId(): Promise<string | null>;

  /**
 * Enables or disables analytics in the Marketing Cloud SDK.
 * @param {boolean} analyticsEnabled - A flag indicating whether analytics should be enabled.
 * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/sdk-implementation/runtime-toggles.html|iOS Docs}
 */
  static setAnalyticsEnabled(analyticsEnabled: boolean): void;

  /**
   * Checks if analytics is enabled in the Marketing Cloud SDK.
   * @returns {Promise<boolean>} A promise to the boolean representation of whether analytics is enabled.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/sdk-implementation/runtime-toggles.html|iOS Docs}
   */
  static isAnalyticsEnabled(): Promise<boolean>;

  /**
   * Enables or disables Predictive Intelligence analytics in the Marketing Cloud SDK.
   * @param {boolean} analyticsEnabled - A flag indicating whether PI analytics should be enabled.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/sdk-implementation/runtime-toggles.html|iOS Docs}
   */
  static setPiAnalyticsEnabled(analyticsEnabled: boolean): void;

  /**
   * Checks if Predictive Intelligence analytics is enabled in the Marketing Cloud SDK.
   * @returns {Promise<boolean>} A promise to the boolean representation of whether PI analytics is enabled.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/sdk-implementation/runtime-toggles.html|iOS Docs}
   */
  static isPiAnalyticsEnabled(): Promise<boolean>;

  /**
   * Retrieves the list of active, read and unread, non-deleted inbox messages.
   * @returns {Promise<InboxMessage[]>} A promise to the list of active inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-messages.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getAllMessages |iOS Docs}
   */
  static getMessages(): Promise<InboxMessage[]>;

  /**
   * Retrieves the list of active, read, non-deleted inbox messages.
   * @returns {Promise<InboxMessage[]>} A promise to the list of read inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-read-messages.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getReadMessages |iOS Docs}
   */
  static getReadMessages(): Promise<InboxMessage[]>;

  /**
   * Retrieves the list of active, unread, non-deleted inbox messages.
   * @returns {Promise<InboxMessage[]>} A promise to the list of unread inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-unread-messages.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getUnreadMessages |iOS Docs}
   */
  static getUnreadMessages(): Promise<InboxMessage[]>;

  /**
   * Retrieves the list of active, deleted inbox messages.
   * @returns {Promise<InboxMessage[]>} A promise to the list of deleted inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-deleted-messages.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getDeletedMessages |iOS Docs}
   */
  static getDeletedMessages(): Promise<InboxMessage[]>;

  /**
   * Marks an inbox message as read in local storage.
   * @param {string} id - The InboxMessage id of the message to mark as read.
   * @returns {Promise<boolean>|void} A promise to the success state on iOS, or void on Android.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/set-message-read.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markMessageWithIdReadWithMessageId: |iOS Docs}
   */
  static setMessageRead(id: string): Promise<boolean> | void;

  /**
   * Marks an inbox message as deleted in local storage.
   * @param {string} id - The InboxMessage id of the message to mark as deleted.
   * @returns {Promise<boolean>|void} A promise to the success state on iOS, or void on Android.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/delete-message.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markMessageWithIdDeletedWithMessageId: |iOS Docs}
   */
  static deleteMessage(id: string): Promise<boolean> | void;

  /**
   * Retrieves the total number of non-deleted inbox messages.
   * @returns {Promise<number>} A promise to the total number of non-deleted inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-message-count.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getAllMessagesCount |iOS Docs}
   */
  static getMessageCount(): Promise<number>;

  /**
   * Retrieves the total number of read, non-deleted inbox messages.
   * @returns {Promise<number>} A promise to the total number of read inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-read-message-count.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getReadMessagesCount |iOS Docs}
   */
  static getReadMessageCount(): Promise<number>;

  /**
   * Retrieves the total number of unread, non-deleted inbox messages.
   * @returns {Promise<number>} A promise to the total number of unread inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-unread-message-count.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getUnreadMessagesCount |iOS Docs}
   */
  static getUnreadMessageCount(): Promise<number>;

  /**
   * Retrieves the total number of deleted inbox messages.
   * @returns {Promise<number>} A promise to the total number of deleted inbox messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-deleted-message-count.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getDeletedMessagesCount |iOS Docs}
   */
  static getDeletedMessageCount(): Promise<number>;

  /**
   * Marks all active, unread inbox messages as read.
   * @returns {Promise<boolean>|void} A promise to the success state on iOS, or void on Android.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/mark-all-messages-read.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markAllMessagesRead |iOS Docs}
   */
  static markAllMessagesRead(): Promise<boolean> | void;

  /**
   * Marks all active inbox messages as deleted.
   * @returns {Promise<boolean>|void} A promise to the success state on iOS, or void on Android.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/mark-all-messages-deleted.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markAllMessagesDeleted |iOS Docs}
   */
  static markAllMessagesDeleted(): Promise<boolean> | void;

  /**
   * Registers the native inbox response listener.
   * @returns {Promise<boolean|string>} A promise to the registration result payload.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/register-inbox-response-listener.html |Android Docs}
   * @see  {@link https://developer.salesforce.com/docs/marketing/mobilepush/guide/implement-inbox-messaging-ios.html |iOS Docs}
   */
  static registerInboxResponseListener(): Promise<boolean | string>;

  /**
   * Unregisters the native inbox response listener.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/unregister-inbox-response-listener.html |Android Docs}
   * @see  {@link https://developer.salesforce.com/docs/marketing/mobilepush/guide/implement-inbox-messaging-ios.html |iOS Docs}
   */
  static unregisterInboxResponseListener(): void;

  /**
   * Requests an updated list of inbox messages from Marketing Cloud servers.
   * @returns {Promise<boolean>} A promise to the refresh result.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/9.0/-marketing%20-cloud%20-s-d-k/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/refresh-inbox.html |Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/9.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)refreshMessages |iOS Docs}
   */
  static refreshInbox(): Promise<boolean>;
}

export * from "./event";
