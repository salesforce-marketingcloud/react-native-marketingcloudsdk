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

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.salesforce.marketingcloud.MCLogListener;
import com.salesforce.marketingcloud.MarketingCloudConfig;
import com.salesforce.marketingcloud.MarketingCloudSdk;

import org.robolectric.annotation.Implementation;
import org.robolectric.annotation.Implements;

// Approximate implementation of static MarketingCloudSdk methods
@Implements(MarketingCloudSdk.class)
public class ShadowMarketingCloudSdk {
    private static final MCLogListener testLogListener = new MCLogListener() {
        @Override
        public void out(
                int i, @NonNull String s, @NonNull String s1, @Nullable Throwable throwable) {
        }
    };

    private static MarketingCloudSdk.WhenReadyListener recentSdkRequest = null;
    private static boolean initializing = false;
    private static boolean ready = false;
    private static MarketingCloudSdk instance;
    private static int logLevel = -1;
    private static MCLogListener currentLogListener = testLogListener;

    public static InitInvocation mostRecentInitInvocation = null;

    public static class InitInvocation {

        final MarketingCloudConfig config;
        final MarketingCloudSdk.InitializationListener listener;

        InitInvocation(MarketingCloudConfig config, MarketingCloudSdk.InitializationListener listener) {
            this.config = config;
            this.listener = listener;
        }
    }

    public static void init(final Context context, final MarketingCloudConfig config, final MarketingCloudSdk.InitializationListener listener) {
        mostRecentInitInvocation = new InitInvocation(config, listener);
    }

    @Implementation
    public static MarketingCloudSdk getInstance() {
        return instance;
    }

    public static void setInstance(MarketingCloudSdk instance) {
        ShadowMarketingCloudSdk.instance = instance;
    }

    @Implementation
    public static boolean isInitializing() {
        return initializing;
    }

    public static void isInitializing(boolean initializing) {
        ShadowMarketingCloudSdk.initializing = initializing;
    }

    @Implementation
    public static boolean isReady() {
        return ready;
    }

    public static void isReady(boolean ready) {
        ShadowMarketingCloudSdk.ready = ready;
    }

    @Implementation
    public static void requestSdk(MarketingCloudSdk.WhenReadyListener listener) {
        recentSdkRequest = listener;
    }

    public static MarketingCloudSdk.WhenReadyListener getRecentSdkRequest() {
        return recentSdkRequest;
    }

    public static int getLogLevel() {
        return logLevel;
    }

    @Implementation
    public static void setLogLevel(int logLevel) {
        ShadowMarketingCloudSdk.logLevel = logLevel;
    }

    public static MCLogListener getLogListener() {
        return currentLogListener;
    }

    @Implementation
    public static void setLogListener(MCLogListener listener) {
        currentLogListener = listener;
    }

    public static void reset() {
        initializing = false;
        ready = false;
        instance = null;
        recentSdkRequest = null;
        logLevel = -1;
        currentLogListener = testLogListener;
    }
}
