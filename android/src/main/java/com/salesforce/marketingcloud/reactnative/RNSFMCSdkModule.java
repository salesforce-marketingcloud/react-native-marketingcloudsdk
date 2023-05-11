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
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.salesforce.marketingcloud.MCLogListener;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdkReadyListener;
import com.salesforce.marketingcloud.sfmcsdk.components.events.Event;
import com.salesforce.marketingcloud.sfmcsdk.components.identity.Identity;
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogLevel;
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogListener;
import com.salesforce.marketingcloud.sfmcsdk.modules.push.PushModuleInterface;
import com.salesforce.marketingcloud.sfmcsdk.modules.push.PushModuleReadyListener;

import java.util.Map;
import java.util.Set;

import javax.annotation.Nonnull;

@SuppressWarnings({"unused", "WeakerAccess"})
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
    public void disableLogging() {
        SFMCSdk.Companion.setLogging(LogLevel.NONE, null);
        MarketingCloudSdk.setLogListener(null);
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

    @ReactMethod
    public void isPushEnabled(Promise promise) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                promise.resolve(sdk.getPushMessageManager().isPushEnabled());
            }
        });
    }

    @ReactMethod
    public void enablePush() {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                sdk.getPushMessageManager().enablePush();
            }
        });
    }

    @ReactMethod
    public void disablePush() {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                sdk.getPushMessageManager().disablePush();
            }
        });
    }

    @ReactMethod
    public void getDeviceId(final Promise promise) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                promise.resolve(sdk.getRegistrationManager().getDeviceId());
            }
        });
    }

    @ReactMethod
    public void getTags(final Promise promise) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                Set<String> tags = sdk.getRegistrationManager().getTags();
                WritableArray array = new WritableNativeArray();
                if (!tags.isEmpty()) {
                    for (String tag : tags) {
                        array.pushString(tag);
                    }
                }
                promise.resolve(array);
            }
        });
    }

    @ReactMethod
    public void addTag(final String tag) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                sdk.getRegistrationManager().edit().addTag(tag).commit();
            }
        });
    }

    @ReactMethod
    public void removeTag(final String tag) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                sdk.getRegistrationManager().edit().removeTag(tag).commit();
            }
        });
    }

    @ReactMethod
    public void getContactKey(final Promise promise) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                promise.resolve(sdk.getRegistrationManager().getContactKey());
            }
        });
    }

    @ReactMethod
    public void setContactKey(final String contactKey) {
        handleIdentityAction(new SFMCIdentityAction() {
            @Override
            void execute(Identity identity) {
                identity.setProfileId(contactKey);
            }
        });
    }

    @ReactMethod
    public void getAttributes(final Promise promise) {
        handlePushAction(new MCPushAction() {
            @Override
            void execute(PushModuleInterface sdk) {
                Map<String, String> attributes = sdk.getRegistrationManager().getAttributes();
                WritableMap writableMap = new WritableNativeMap();
                if (!attributes.isEmpty()) {
                    for (Map.Entry<String, String> entry : attributes.entrySet()) {
                        writableMap.putString(entry.getKey(), entry.getValue());
                    }
                }
                promise.resolve(writableMap);
            }
        });
    }

    @ReactMethod
    public void setAttribute(final String key, final String value) {
        handleIdentityAction(new SFMCIdentityAction() {
            @Override
            void execute(Identity identity) {
                identity.setProfileAttribute(key, value);
            }
        });
    }

    @ReactMethod
    public void clearAttribute(final String key) {
        handleIdentityAction(new SFMCIdentityAction() {
            @Override
            void execute(Identity identity) {
                identity.clearProfileAttribute(key);
            }
        });
    }

    @ReactMethod
    public void track(final ReadableMap event) {
        Event sfmcEvent = EventUtility.toEvent(event);
        SFMCSdk.track(sfmcEvent);
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

    private void handleIdentityAction(final SFMCIdentityAction action) {
        SFMCSdk.requestSdk(new SFMCSdkReadyListener() {
            @Override
            public void ready(@NonNull SFMCSdk sfmcSdk) {
                action.execute(sfmcSdk.identity);
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

    abstract class SFMCIdentityAction {
        abstract void execute(Identity identity);

        void err() {
        }
    }

    abstract class SFMCIdentityPromiseAction extends SFMCIdentityAction {
        private final Promise promise;

        SFMCIdentityPromiseAction(@Nonnull Promise promise) {
            this.promise = promise;
        }

        @Override
        final void execute(Identity identity) {
            execute(identity, promise);
        }

        @Override
        void err() {
            promise.reject("SFMCSDK-INIT",
                    "The SFMCSdk#configure method must be called in the Application's onCreate.");
        }

        abstract void execute(Identity sdk, @NonNull Promise promise);
    }

}