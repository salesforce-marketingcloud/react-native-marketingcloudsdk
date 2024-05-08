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
 * @class SFMCInboxModule
 */

export interface InboxMessage {
  id: string
  alert: string
  subject: string
  custom: string
  name: string | null
  title: string
  url: string
  deleted: boolean
  read: boolean
  sound: string
  subtitle: string | null
  startDate: number
  endDate: number
  sendDate: number
}

export class SFMCInboxModule {
  /**
   * Marks an InboxMessage as deleted in local storage. This will prevent the message from being shown in the future unless local storage is cleared on the device.
   * @param  {string} messageId - The id of the InboxMessage to mark as deleted.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/delete-message.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markMessageWithIdDeletedWithMessageId:|iOS Docs}
   */
  static deleteMessage(messageId: string): Promise<void>;
  /**
   * Get the number of deleted Inbox Messages regardless of their read status.
   * @returns {Promise<number>} A numerical representation of the total number of deleted messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-deleted-message-count.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getDeletedMessagesCount|iOS Docs}
   */
  static getDeletedMessageCount(): Promise<number>;
  /**
   * Gets a list of Active, Deleted Inbox Messages.
   * A Inbox Message is considered Active if its startDateUtc is in the past and its endDateUtc is NULL or in the future.
   * @returns {Promise<InboxMessage[]>} An array of Inbox Messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-deleted-messages.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getDeletedMessages|iOS Docs}
   */
  static getDeletedMessages(): Promise<InboxMessage[]>;
  /**
   * Gets a list of active, read, and unread Inbox Messages that are not deleted.
   * @returns {Promise<InboxMessage[]>} An array of Inbox Messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-messages.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getAllMessages|iOS Docs}
   */
  static getMessages(): Promise<InboxMessage[]>;
  /**
   * Get the total number of not deleted Inbox Messages regardless of their read status.
   * @returns {Promise<number>} a representation of the total number of messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-message-count.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getAllMessagesCount|iOS Docs}
   */
  static getMessageCount(): Promise<number>;
  /**
   * Get the number of read, non-deleted Inbox Messages.
   * @returns {Promise<number>} a representation of the number of read messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-read-message-count.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getReadMessagesCount|iOS Docs}
   */
  static getReadMessageCount(): Promise<number>;
  /**
   * Gets a list of active, read, not deleted Inbox Messages.
   * @returns {Promise<InboxMessage[]>} an array of Inbox Messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-read-messages.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getReadMessages|iOS Docs}
   */
  static getReadMessages(): Promise<InboxMessage[]>;
  /**
   * Get the number of unread, non-deleted Inbox Messages.
   * @returns {Promise<number>} a representation of the number of unread messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-unread-message-count.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getUnreadMessagesCount|iOS Docs}
   */
  static getUnreadMessageCount(): Promise<number>;
  /**
   * Gets a list of active, unread, non-deleted Inbox Messages.
   * @returns {Promise<InboxMessage[]>} an array of Inbox Messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/get-unread-messages.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)getUnreadMessages|iOS Docs}
   */
  static getUnreadMessages(): Promise<InboxMessage[]>;
  /**
   * Marks all active InboxMessages as deleted.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/mark-all-messages-deleted.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markAllMessagesDeleted|iOS Docs}
   */
  static markAllMessagesDeleted(): Promise<void>;
  /**
   * Marks all active, unread InboxMessages as read.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/mark-all-messages-read.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markAllMessagesRead|iOS Docs}
   */
  static markAllMessagesRead(): Promise<void>;
  /**
   * Requests an updated list of Inbox Messages from the Marketing Cloud Servers. This request can be made, at most, once per minute. This throttle also includes the Inbox request that is made by the SDK when your application is brought into the foreground.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/refresh-inbox.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)refreshMessages|iOS Docs}
   */
  static refreshInbox(): Promise<boolean>;
  /**
   * Marks an InboxMessage as read in local storage. This status will persist unless local storage is cleared on the device.
   * @param  {string} messageId - the id of the InboxMessage to mark as read.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/set-message-read.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)markMessageWithIdReadWithMessageId:|iOS Docs}
   */
  static setMessageRead(id: string): Promise<void>;
  /**
   * This method is called upon the completed of the Inbox Message refresh attempt.
   * @callback  refreshCallback - callback function invoked after Inbox Messages refresh.
   * @param  {messages} messages - array of Inbox Messages.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.inbox/-inbox-message-manager/-inbox-refresh-listener/index.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Constants.html#/c:@SFMCInboxMessagesRefreshCompleteNotification|iOS Docs}
   */
  static inboxListener(callback: (messages: InboxMessage[]) => void): void;
}
