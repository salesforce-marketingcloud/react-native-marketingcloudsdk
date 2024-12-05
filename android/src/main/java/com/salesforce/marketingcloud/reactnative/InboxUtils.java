package com.salesforce.marketingcloud.reactnative;

import com.salesforce.marketingcloud.messages.inbox.InboxMessage;

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

    public static String asDateString(Date date) {
        if (date == null)
            return null;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }

    private static WritableMap hashMapToWritableMap(Map<String, String> map) {
        WritableMap writableMap = new WritableNativeMap();
        if (!map.isEmpty()) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                writableMap.putString(entry.getKey(), entry.getValue());
            }
        }
        return writableMap;
    }

    public static WritableMap toWritableMap(InboxMessage message) {
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
            map.putString("startDateUtc", asDateString(message.startDateUtc()));
        }
        if (message.sendDateUtc() != null) {
            map.putString("sendDateUtc", asDateString(message.sendDateUtc()));
        }
        if (message.endDateUtc() != null) {
            map.putString("endDateUtc", asDateString(message.endDateUtc()));
        }

        map.putString("url", message.url());

        if (message.custom() != null) {
            map.putString("custom", message.custom());
        }
        if (message.customKeys() != null) {
            map.putMap("keys", hashMapToWritableMap(message.customKeys()));
        }

        return map;
    }

    public static WritableArray inboxMessagesToWritableArray(List<InboxMessage> messages) {
        WritableArray writableArray = new WritableNativeArray();
        if (messages == null)
            return writableArray;

        for (InboxMessage message : messages) {
            WritableMap map = toWritableMap(message);
            if (map != null) {
                writableArray.pushMap(map);
            }
        }
        return writableArray;
    }
}
