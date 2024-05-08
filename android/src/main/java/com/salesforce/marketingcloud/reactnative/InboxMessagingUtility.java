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

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.salesforce.marketingcloud.messages.inbox.InboxMessage;

import java.util.List;

public class InboxMessagingUtility {
    public static WritableMap mapInboxMessage(InboxMessage message) {
        WritableMap result = Arguments.createMap();
        result.putString("id", message.id());
        result.putString("alert", message.alert());
        result.putString("subject", message.subject());
        result.putString("custom", message.custom());
        result.putNull("name");
        result.putString("title", message.title());
        result.putString("url", message.url());
        result.putBoolean("deleted", message.deleted());
        result.putBoolean("read", message.read());
        result.putString("sound", message.sound());
        result.putNull("subtitle");
        result.putDouble("startDate", message.startDateUtc().getTime());
        result.putDouble("endDate", message.endDateUtc().getTime());
        result.putDouble("sendDate", message.sendDateUtc().getTime());

        return result;
    }

    public static WritableArray mapInboxMessages(List<InboxMessage> messages) {
        WritableArray result = Arguments.createArray();

        for (InboxMessage message : messages) {
            result.pushMap(mapInboxMessage(message));
        }

        return result;
    }
}
