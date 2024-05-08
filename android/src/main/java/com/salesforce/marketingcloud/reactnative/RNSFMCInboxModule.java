/*
  Copyright 2019 Salesforce, Inc
  <p>
  Redistribution and use in source and binary forms, with or without modification, are permitted
  provided that the following conditions are met:
  <p>
  1. Redistributions of source code must retain the above copyright notice, this list of
  conditions and the following disclaimer.
  <p>
  2. Redistributions in binary form must reproduce the above copyright notice, this list of
  conditions and the following disclaimer in the documentation and/or other materials provided
  with the distribution.
  <p>
  3. Neither the name of the copyright holder nor the names of its contributors may be used to
  endorse or promote products derived from this software without specific prior written permission.
  <p>
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
  FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.salesforce.marketingcloud.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.salesforce.marketingcloud.messages.inbox.InboxMessage;
import com.salesforce.marketingcloud.messages.inbox.InboxMessageManager;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdkReadyListener;
import com.salesforce.marketingcloud.sfmcsdk.modules.push.PushModuleInterface;
import com.salesforce.marketingcloud.sfmcsdk.modules.push.PushModuleReadyListener;

import java.util.List;

@SuppressWarnings({"unused", "WeakerAccess"})
public class RNSFMCInboxModule extends ReactContextBaseJavaModule implements InboxMessageManager.InboxResponseListener {
    private final ReactApplicationContext context;
    private InboxMessageManager inboxMessageManager;
    private int listenerCount = 0;

    public RNSFMCInboxModule(ReactApplicationContext context) {
        super(context);
        this.context = context;

        this.requestInboxMessageManager();
    }

    private void requestInboxMessageManager() {
        SFMCSdk.requestSdk(new SFMCSdkReadyListener() {
            @Override
            public void ready(@NonNull SFMCSdk sfmcSdk) {
                sfmcSdk.mp(new PushModuleReadyListener() {
                    @Override
                    public void ready(@NonNull PushModuleInterface pushModuleInterface) {
                        inboxMessageManager = pushModuleInterface.getInboxMessageManager();
                    }
                });
            }
        });
    }

    private boolean isSdkNotInitialized(Promise promise) {
        if (inboxMessageManager == null) {
            promise.reject("SFMCSDK-INBOX",
                    "The instance of MarketingCloudSdk is not found, MarketingCloudSdk should be initialized before the Inbox messaging usage.");
            return true;
        }
        return false;
    }

    private boolean isSdkNotInitialized() {
        return inboxMessageManager == null;
    }


    @ReactMethod
    public void deleteMessage(String id) {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.deleteMessage(id);
    }

    @ReactMethod
    public void getDeletedMessageCount(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        int count = inboxMessageManager.getDeletedMessageCount();
        promise.resolve(count);
    }

    @ReactMethod
    public void getDeletedMessages(Promise promise) {
        if (isSdkNotInitialized(promise)) return;

        List<InboxMessage> messages = inboxMessageManager.getDeletedMessages();
        WritableArray result = InboxMessagingUtility.mapInboxMessages(messages);

        promise.resolve(result);
    }

    @ReactMethod
    public void getMessages(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        List<InboxMessage> messages = inboxMessageManager.getMessages();
        WritableArray result = InboxMessagingUtility.mapInboxMessages(messages);

        promise.resolve(result);
    }

    @ReactMethod
    public void getMessageCount(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        int count = inboxMessageManager.getMessageCount();

        promise.resolve(count);
    }

    @ReactMethod
    public void getReadMessageCount(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        int count = inboxMessageManager.getReadMessageCount();
        promise.resolve(count);
    }

    @ReactMethod
    public void getReadMessages(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        List<InboxMessage> messages = inboxMessageManager.getReadMessages();
        WritableArray result = InboxMessagingUtility.mapInboxMessages(messages);

        promise.resolve(result);
    }

    @ReactMethod
    public void getUnreadMessageCount(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        int count = inboxMessageManager.getUnreadMessageCount();
        promise.resolve(count);
    }

    @ReactMethod
    public void getUnreadMessages(Promise promise) {
        if (isSdkNotInitialized(promise)) return;
        List<InboxMessage> messages = inboxMessageManager.getUnreadMessages();
        WritableArray result = InboxMessagingUtility.mapInboxMessages(messages);

        promise.resolve(result);
    }

    @ReactMethod
    public void markAllMessagesDeleted() {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.markAllMessagesDeleted();
    }

    @ReactMethod
    public void markAllMessagesRead() {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.markAllMessagesRead();
    }


    @ReactMethod
    public void refreshInbox(Promise promise) {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.refreshInbox(promise::resolve);
    }


    @ReactMethod
    public void setMessageRead(String messageId) {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.setMessageRead(messageId);
    }


    @Override
    public String getName() {
        return "RNSFMCInboxModule";
    }

    private void sendEvent(ReactApplicationContext reactContext,
                           @NonNull WritableArray params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("ON_INBOX_MESSAGES_CHANGED", params);
    }

    public void onInboxMessagesChangedEvent() {
        if (isSdkNotInitialized()) return;

        List<InboxMessage> messages = inboxMessageManager.getMessages();
        WritableArray result = InboxMessagingUtility.mapInboxMessages(messages);

        sendEvent(context, result);
    }

    @Override
    public void onInboxMessagesChanged(@NonNull List<InboxMessage> list) {
        if (listenerCount != 0) {
            onInboxMessagesChangedEvent();
        }
    }

    @ReactMethod
    public void addListener(String _eventName) {
        if (listenerCount == 0) {
            startObserving();
        }
        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(int count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            stopObserving();
        }
    }

    private void startObserving() {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.registerInboxResponseListener(this);
    }

    private void stopObserving() {
        if (isSdkNotInitialized()) return;
        inboxMessageManager.unregisterInboxResponseListener(this);
    }

}
