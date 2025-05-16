package com.salesforce.marketingcloud.reactnative;

import com.salesforce.marketingcloud.messages.inbox.InboxMessage;
import com.salesforce.marketingcloud.notifications.NotificationMessage;

import androidx.annotation.NonNull;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

public class InboxUtils {

    public static String dateToString(Date date) {
        if (date == null)
            return null;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }

    private static WritableMap mapToWritableMap(@NonNull Map<String, String> map) {
        WritableMap writableMap = new WritableNativeMap();
        if (!map.isEmpty()) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                writableMap.putString(entry.getKey(), entry.getValue());
            }
        }
        return writableMap;
    }

    private static WritableMap notificationMessageToWritableMap(@NonNull NotificationMessage message) {
        if (message == null)
            return null;

        WritableMap map = new WritableNativeMap();

        map.putString("id", message.id());
        map.putString("alert", message.alert());
        map.putString("sound", message.sound().name());
        map.putString("type", message.type.name());
        map.putString("trigger", message.trigger.name());
        if (message.soundName() != null)
            map.putString("soundName", message.soundName());
        if (message.title() != null)
            map.putString("title", message.title());    
        if (message.subtitle() != null)
            map.putString("subtitle", message.subtitle());
        if (message.url() != null)
            map.putString("url", message.url());   
        if (message.mediaUrl() != null)
            map.putString("mediaUrl", message.mediaUrl());             
        if (message.mediaAltText() != null)
            map.putString("mediaAltText", message.mediaAltText());
        if (message.customKeys() != null)
            map.putMap("customKeys", mapToWritableMap(message.customKeys()));
        if (message.custom() != null)
            map.putString("custom", message.custom());
        if (message.payload() != null)
            map.putMap("payload", mapToWritableMap(message.payload()));                
        return map;
    }

    public static WritableMap inboxMessageToWritableMap(@NonNull InboxMessage message) {
        if (message == null)
            return null;

        WritableMap map = new WritableNativeMap();

        map.putString("id", message.id());

        if (message.subject() != null)
            map.putString("subject", message.subject());
        if (message.title() != null)
            map.putString("title", message.title());
        if (message.alert() != null)
            map.putString("alert", message.alert());
        if (message.sound() != null)
            map.putString("sound", message.sound());
        map.putBoolean("read", message.read());
        map.putBoolean("deleted", message.deleted());

        if (message.media() != null) {
            WritableMap mediaObject = new WritableNativeMap();
            mediaObject.putString("altText", message.media().altText());
            mediaObject.putString("url", message.media().url());
            map.putMap("media", mediaObject);
        }

        if (message.startDateUtc() != null) {
            map.putString("startDateUtc", dateToString(message.startDateUtc()));
        }
        if (message.sendDateUtc() != null) {
            map.putString("sendDateUtc", dateToString(message.sendDateUtc()));
        }
        if (message.endDateUtc() != null) {
            map.putString("endDateUtc", dateToString(message.endDateUtc()));
        }

        if (message.custom() != null) {
            map.putString("custom", message.custom());
        }
        if (message.customKeys() != null) {
            map.putMap("keys", mapToWritableMap(message.customKeys()));
        }
        if(message.messageType != null) {
            map.putString("calculatedType", message.messageType.toString());
            map.putString("messageType", message.messageType.toString());
        }
        if(message.url() != null)
            map.putString("url", message.url());
        if(message.subtitle != null)
            map.putString("subtitle", message.subtitle);
        if(message.inboxMessage != null)
            map.putString("inboxMessage", message.inboxMessage);
        if(message.inboxSubtitle != null)
            map.putString("inboxSubtitle", message.inboxSubtitle);
        if(message.notificationMessage != null)
            map.putMap("notificationMessage", notificationMessageToWritableMap(message.notificationMessage));
        return map;
    }

    public static WritableArray inboxMessagesToWritableArray(@NonNull List<InboxMessage> messages) {
        WritableArray writableArray = new WritableNativeArray();
        if (messages == null)
            return writableArray;

        for (InboxMessage message : messages) {
            WritableMap map = inboxMessageToWritableMap(message);
            if (map != null) {
                writableArray.pushMap(map);
            }
        }
        return writableArray;
    }
}
