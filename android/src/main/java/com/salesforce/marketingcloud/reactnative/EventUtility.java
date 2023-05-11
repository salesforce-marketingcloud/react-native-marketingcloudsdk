package com.salesforce.marketingcloud.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.salesforce.marketingcloud.sfmcsdk.components.events.CartEvent;
import com.salesforce.marketingcloud.sfmcsdk.components.events.CatalogEvent;
import com.salesforce.marketingcloud.sfmcsdk.components.events.CatalogObject;
import com.salesforce.marketingcloud.sfmcsdk.components.events.Event;
import com.salesforce.marketingcloud.sfmcsdk.components.events.EventManager;
import com.salesforce.marketingcloud.sfmcsdk.components.events.LineItem;
import com.salesforce.marketingcloud.sfmcsdk.components.events.Order;
import com.salesforce.marketingcloud.sfmcsdk.components.events.OrderEvent;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class EventUtility {

    static Event toEvent(ReadableMap map) {
        try {
            JSONObject jsonObject = toJSONObject(map);
            String objType = jsonObject.optString("objType");
            switch (objType) {
                case "CartEvent":
                    return createCartEvent(jsonObject);
                case "CustomEvent":
                    return EventManager.customEvent(jsonObject.optString("name"), toMap(jsonObject.optJSONObject("attributes")));
                case "OrderEvent":
                    return createOrderEvent(jsonObject);
                case "CatalogObjectEvent":
                    return createCatalogEvent(jsonObject);
                default:
                    return checkForOtherEvents(jsonObject);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static Event createCatalogEvent(JSONObject jsonObject) throws JSONException {
        String category = jsonObject.optString("name");
        switch (category) {
            case "Comment Catalog Object":
                return CatalogEvent.comment(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
            case "View Catalog Object":
                return CatalogEvent.view(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
            case "Quick View Catalog Object":
                return CatalogEvent.quickView(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
            case "View Catalog Object Detail":
                return CatalogEvent.viewDetail(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
            case "Favorite Catalog Object":
                return CatalogEvent.favorite(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
            case "Share Catalog Object":
                return CatalogEvent.share(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
            case "Review Catalog Object":
                return CatalogEvent.review(getCatalogObject(jsonObject.optJSONObject("catalogObject")));
        }
        return null;
    }

    private static CatalogObject getCatalogObject(JSONObject catalogObject) throws JSONException {
        String type = catalogObject.optString("type");
        String id = catalogObject.optString("id");
        JSONObject attributes = catalogObject.optJSONObject("attributes");
        JSONObject relatedCatalogObjects = catalogObject.optJSONObject("relatedCatalogObjects");
        return new CatalogObject(type, id, toMap(attributes), getRelatedCatalogObjects(relatedCatalogObjects));
    }

    private static Map<String, List<String>> getRelatedCatalogObjects(JSONObject relatedCatalogObjects) {
        if (relatedCatalogObjects == null) {
            return null;
        }
        Map<String, List<String>> map = new HashMap<>();
        Iterator<String> iterator = relatedCatalogObjects.keys();

        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = relatedCatalogObjects.opt(key);
            if (value instanceof JSONArray) {
                map.put(key, toList((JSONArray) value));
            }
        }
        return map;
    }

    private static List<String> toList(JSONArray jsonArray) {
        if (jsonArray == null || jsonArray.length() < 1) {
            return null;
        }
        List<String> objectIds = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            objectIds.add(jsonArray.optString(i));
        }
        return objectIds;
    }

    private static Event checkForOtherEvents(JSONObject jsonObject) throws JSONException {
        String category = jsonObject.optString("category");
        switch (category) {
            case "system":
                return EventManager.customEvent(jsonObject.optString("name"),
                        toMap(jsonObject.optJSONObject("attributes")),
                        Event.Producer.PUSH, //todo - check whether it should be SFMC or PUSH?
                        Event.Category.SYSTEM);
            case "engagement":
                return EventManager.customEvent(jsonObject.optString("name"),
                        toMap(jsonObject.optJSONObject("attributes")),
                        Event.Producer.PUSH,
                        Event.Category.ENGAGEMENT);
            default:
                return null;
        }
    }

    private static OrderEvent createOrderEvent(JSONObject jsonObject) {
        OrderEvent orderEvent = null;
        switch (jsonObject.optString("name")) {
            case "Purchase":
                orderEvent = OrderEvent.purchase(getOrder(jsonObject.optJSONObject("order")));
                break;
            case "Preorder":
                orderEvent = OrderEvent.preorder(getOrder(jsonObject.optJSONObject("order")));
                break;
            case "Cancel":
                orderEvent = OrderEvent.cancel(getOrder(jsonObject.optJSONObject("order")));
                break;
            case "Ship":
                orderEvent = OrderEvent.ship(getOrder(jsonObject.optJSONObject("order")));
                break;
            case "Deliver":
                orderEvent = OrderEvent.deliver(getOrder(jsonObject.optJSONObject("order")));
                break;
            case "Return":
                orderEvent = OrderEvent.returnOrder(getOrder(jsonObject.optJSONObject("order")));
                break;
            case "Exchange":
                orderEvent = OrderEvent.exchange(getOrder(jsonObject.optJSONObject("order")));
                break;
        }
        return orderEvent;
    }

    private static Order getOrder(JSONObject order) {
        String id = order.optString("id");
        String currency = order.optString("currency");
        double totalValue = order.optDouble("totalValue");
        JSONArray lineItems = order.optJSONArray("lineItems");
        JSONObject attributes = order.optJSONObject("attributes");
        Map<String, Object> attributesMap = getAttributesMap(attributes);
        if (attributesMap == null) {
            return new Order(id, getLineItems(lineItems), totalValue, currency);
        } else {
            return new Order(id, getLineItems(lineItems), totalValue, currency, attributesMap);
        }
    }

    @Nullable
    private static Map<String, Object> getAttributesMap(JSONObject attributes) {
        Map<String, Object> attributesMap = null;
        try {
            attributesMap = toMap(attributes);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return attributesMap;
    }

    private static List<LineItem> getLineItems(JSONArray jsonArray) {
        List<LineItem> items = null;
        if (jsonArray != null && jsonArray.length() > 0) {
            items = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                try {
                    LineItem item = getLineItem(jsonArray.getJSONObject(i));
                    items.add(item);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return items;
    }

    private static CartEvent createCartEvent(JSONObject jsonObject) {
        CartEvent cartEvent = null;
        final LineItem lineItem = getLineItem(jsonObject.optJSONObject("lineItem"));
        switch (jsonObject.optString("name")) {
            case "Add To Cart":
                cartEvent = CartEvent.add(lineItem);
                break;
            case "Remove From Cart":
                cartEvent = CartEvent.remove(lineItem);
                break;
            case "Replace Cart":
                cartEvent = CartEvent.replace(new ArrayList<LineItem>() {{
                    add(lineItem);
                }});
                break;
            default:
                break;
        }
        return cartEvent;
    }

    private static LineItem getLineItem(JSONObject lineItem) {
        String catalogObjectType = lineItem.optString("catalogObjectType");
        String catalogObjectId = lineItem.optString("catalogObjectId");
        int quantity = lineItem.optInt("quantity");
        double price = lineItem.optDouble("price");
        String currency = lineItem.optString("currency");
        JSONObject attributes = lineItem.optJSONObject("attributes");
        Map<String, Object> attributesMap = getAttributesMap(attributes);
        if (attributesMap == null) {
            return new LineItem(catalogObjectType, catalogObjectId, quantity, price, currency);
        }
        return new LineItem(catalogObjectType, catalogObjectId, quantity, price, currency, attributesMap);
    }


    private static JSONObject toJSONObject(ReadableMap readableMap) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);
            switch (type) {
                case Boolean:
                    jsonObject.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    jsonObject.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    jsonObject.put(key, readableMap.getString(key));
                    break;
                case Map:
                    jsonObject.put(key, toJSONObject(readableMap.getMap(key)));
                    break;
                case Array:
                    jsonObject.put(key, toJSONArray(readableMap.getArray(key)));
                    break;
            }
        }
        return jsonObject;
    }

    private static JSONArray toJSONArray(ReadableArray readableArray) throws JSONException {
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);
            switch (type) {
                case Null:
                    jsonArray.put(i, null);
                    break;
                case Boolean:
                    jsonArray.put(i, readableArray.getBoolean(i));
                    break;
                case Number:
                    jsonArray.put(i, readableArray.getDouble(i));
                    break;
                case String:
                    jsonArray.put(i, readableArray.getString(i));
                    break;
                case Map:
                    jsonArray.put(i, toJSONObject(readableArray.getMap(i)));
                    break;
                case Array:
                    jsonArray.put(i, toJSONArray(readableArray.getArray(i)));
                    break;
            }
        }
        return jsonArray;
    }

    private static Map<String, Object> toMap(@Nullable JSONObject jsonObject) throws JSONException {
        if (jsonObject == null) {
            return null;
        }

        Map<String, Object> map = new HashMap<>();
        Iterator<String> iterator = jsonObject.keys();

        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);

            if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            if (value instanceof JSONArray) {
                value = toArray((JSONArray) value);
            }
            map.put(key, value);
        }
        return map;
    }

    private static Map<String, Object> toMap(ReadableMap readableMap) {
        Map<String, Object> map = new HashMap<>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);
            switch (type) {
                case Null:
                    map.put(key, null);
                    break;
                case Boolean:
                    map.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    map.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    map.put(key, readableMap.getString(key));
                    break;
                case Map:
                    map.put(key, toMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, toArray(readableMap.getArray(key)));
                    break;
            }
        }

        return map;
    }

    private static Object[] toArray(JSONArray jsonArray) throws JSONException {
        Object[] array = new Object[jsonArray.length()];

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);

            if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            if (value instanceof JSONArray) {
                value = toArray((JSONArray) value);
            }
            array[i] = value;
        }
        return array;
    }

    private static Object[] toArray(ReadableArray readableArray) {
        Object[] array = new Object[readableArray.size()];

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);

            switch (type) {
                case Null:
                    array[i] = null;
                    break;
                case Boolean:
                    array[i] = readableArray.getBoolean(i);
                    break;
                case Number:
                    array[i] = readableArray.getDouble(i);
                    break;
                case String:
                    array[i] = readableArray.getString(i);
                    break;
                case Map:
                    array[i] = toMap(readableArray.getMap(i));
                    break;
                case Array:
                    array[i] = toArray(readableArray.getArray(i));
                    break;
            }
        }
        return array;
    }
}
