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

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.salesforce.marketingcloud.MCLogListener;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdkReadyListener;
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogLevel;
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogListener;
import com.salesforce.marketingcloud.sfmcsdk.modules.push.PushModuleInterface;
import com.salesforce.marketingcloud.sfmcsdk.modules.push.PushModuleReadyListener;

import javax.annotation.Nonnull;

@SuppressWarnings({ "unused", "WeakerAccess" })
public class RNSFMCSdkModule extends ReactContextBaseJavaModule {
    public RNSFMCSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNSFMCSdk";
    }

    @ReactMethod
    public void logSdkState() {
        handleAction(new SFMCAction() {
            @Override
            void execute(SFMCSdk sdk) {
                try {
                    log("~#RNMCSdkModule", "SDK State: " + sdk.getSdkState().toString(2));
                } catch (Exception e) {
                    // NO-OP
                }
            }
        });
    }

    @ReactMethod
    public void enableLogging() {
        SFMCSdk.Companion.setLogging(LogLevel.DEBUG, new LogListener.AndroidLogger());
        MarketingCloudSdk.setLogLevel(MCLogListener.VERBOSE);
        MarketingCloudSdk.setLogListener(new MCLogListener.AndroidLogListener());
    }

    @ReactMethod
    public void getSystemToken(Promise promise) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                promise.resolve(sdk.getPushMessageManager().getPushToken());
            }
        });
    }

    private void handleAction(final SFMCAction action) {
        SFMCSdk.requestSdk(new SFMCSdkReadyListener() {
            @Override
            public void ready(@NonNull SFMCSdk sfmcSdk) {
                action.execute(sfmcSdk);
            }
        });
    }

    private void handlePushAction(final MCPushAction action) {
        SFMCSdk.requestSdk(new SFMCSdkReadyListener() {
            @Override
            public void ready(@NonNull SFMCSdk sfmcSdk) {
                sfmcSdk.mp(new PushModuleReadyListener() {
                    @Override
                    public void ready(@NonNull PushModuleInterface pushModuleInterface) {
                        action.execute(pushModuleInterface);
                    }
                });
            }
        });
    }

    private static int MAX_LOG_LENGTH = 4000;

    private static void log(String tag, String msg) {
        for (int i = 0, length = msg.length(); i < length; i += MAX_LOG_LENGTH) {
            Log.println(Log.DEBUG, tag, msg.substring(i, Math.min(length, i + MAX_LOG_LENGTH)));
        }
    }

    abstract class SFMCAction {
        abstract void execute(SFMCSdk sdk);

        void err() {
        }
    }

    abstract class SFMCPromiseAction extends SFMCAction {
        private final Promise promise;

        SFMCPromiseAction(@Nonnull Promise promise) {
            this.promise = promise;
        }

        @Override
        final void execute(SFMCSdk sdk) {
            execute(sdk, promise);
        }

        @Override
        void err() {
            promise.reject("SFMCSDK-INIT",
                    "The MarketingCloudSdk#init method must be called in the Application's onCreate.");
        }

        abstract void execute(SFMCSdk sdk, @NonNull Promise promise);
    }

    abstract class MCPushAction {
        abstract void execute(PushModuleInterface pushSdk);

        void err() {
        }
    }

    abstract class MCPushPromiseAction extends MCPushAction {
        private final Promise promise;

        MCPushPromiseAction(@Nonnull Promise promise) {
            this.promise = promise;
        }

        @Override
        final void execute(PushModuleInterface sdk) {
            execute(sdk, promise);
        }

        @Override
        void err() {
            promise.reject("SFMCSDK-INIT",
                    "The MarketingCloudSdk#init method must be called in the Application's onCreate.");
        }

        abstract void execute(PushModuleInterface sdk, @NonNull Promise promise);
    }

}