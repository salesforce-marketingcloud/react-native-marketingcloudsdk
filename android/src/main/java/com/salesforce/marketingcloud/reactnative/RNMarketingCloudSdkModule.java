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
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.salesforce.marketingcloud.MCLogListener;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.events.EventManager;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import javax.annotation.Nonnull;

@SuppressWarnings({"unused", "WeakerAccess"})
public class RNMarketingCloudSdkModule extends ReactContextBaseJavaModule {
    public RNMarketingCloudSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNMarketingCloudSdk";
    }

    @ReactMethod
    public void isPushEnabled(Promise promise) {
        handleAction(new PromiseAction(promise) {
            @Override
            void execute(MarketingCloudSdk sdk, @NonNull Promise promise) {
                promise.resolve(sdk.getPushMessageManager().isPushEnabled());
            }
        });
    }

    @ReactMethod
    public void enablePush() {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getPushMessageManager().enablePush();
            }
        });
    }

    @ReactMethod
    public void disablePush() {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getPushMessageManager().disablePush();
            }
        });
    }

    @ReactMethod
    public void getSystemToken(Promise promise) {
        handleAction(new PromiseAction(promise) {
            @Override
            void execute(MarketingCloudSdk sdk, @NonNull Promise promise) {
                promise.resolve(sdk.getPushMessageManager().getPushToken());
            }
        });
    }

    @ReactMethod
    public void getDeviceID(Promise promise) {
        handleAction(new PromiseAction(promise) {
            @Override
            void execute(MarketingCloudSdk sdk, @NonNull Promise promise) {
                promise.resolve(sdk.getRegistrationManager().getDeviceId());
            }
        });
    }

    @ReactMethod
    public void getAttributes(Promise promise) {
        handleAction(new PromiseAction(promise) {
            @Override
            void execute(MarketingCloudSdk sdk, @NonNull Promise promise) {
                Map<String, String> attributes = sdk.getRegistrationManager().getAttributes();
                WritableMap writableMap = Arguments.createMap();
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
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getRegistrationManager().edit().setAttribute(key, value).commit();
            }
        });
    }

    @ReactMethod
    public void clearAttribute(final String key) {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getRegistrationManager().edit().clearAttribute(key).commit();
            }
        });
    }

    @ReactMethod
    public void addTag(final String tag) {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getRegistrationManager().edit().addTag(tag).commit();
            }
        });
    }

    @ReactMethod
    public void removeTag(final String tag) {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getRegistrationManager().edit().removeTag(tag).commit();
            }
        });
    }

    @ReactMethod
    public void getTags(Promise promise) {
        handleAction(new PromiseAction(promise) {
            @Override
            void execute(MarketingCloudSdk sdk, @NonNull Promise promise) {
                Set<String> tags = sdk.getRegistrationManager().getTags();
                WritableArray array = Arguments.createArray();
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
    public void setContactKey(final String contactKey) {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                sdk.getRegistrationManager().edit().setContactKey(contactKey).commit();
            }
        });
    }

    @ReactMethod
    public void getContactKey(final Promise promise) {
        handleAction(new PromiseAction(promise) {
            @Override
            void execute(MarketingCloudSdk sdk, @NonNull Promise promise) {
                promise.resolve(sdk.getRegistrationManager().getContactKey());
            }
        });
    }

    @ReactMethod
    public void enableVerboseLogging() {
        MarketingCloudSdk.setLogLevel(MCLogListener.VERBOSE);
        MarketingCloudSdk.setLogListener(new MCLogListener.AndroidLogListener());
    }

    @ReactMethod
    public void disableVerboseLogging() {
        MarketingCloudSdk.setLogListener(null);
    }

    @ReactMethod
    public void logSdkState() {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                try {
                    log("~#RNMCSdkModule", "SDK State: " + sdk.getSdkState().toString(2));
                } catch(Exception e) {
                    // NO-OP
                }
            }
        });
    }

    @ReactMethod
    public void track(final String name, final ReadableMap attributes) {
        handleAction(new Action() {
            @Override
            void execute(MarketingCloudSdk sdk) {
                try {
                    sdk.getEventManager().track(EventManager.customEvent(name, attributes.toHashMap()));
                    log("~#RNMCSdkModule", name + " Event Tracked.");
                } catch(Exception e) {
                    log("~#RNMCSdkModule", "Error Tracking Event: " + e.getMessage());
                }
            }
        });
    }

    private void handleAction(final Action action) {
        boolean initializing = MarketingCloudSdk.isInitializing();
        boolean ready = MarketingCloudSdk.isReady();

        if (ready) {
            action.execute(MarketingCloudSdk.getInstance());
        } else if (initializing) {
            MarketingCloudSdk.requestSdk(new MarketingCloudSdk.WhenReadyListener() {
                @Override
                public void ready(@NonNull MarketingCloudSdk marketingCloudSdk) {
                    action.execute(marketingCloudSdk);
                }
            });
        } else {
            action.err();
        }
    }

    private static int MAX_LOG_LENGTH = 4000;

    private static void log(String tag, String msg) {
        for (int i = 0, length = msg.length(); i < length; i += MAX_LOG_LENGTH) {
            Log.println(Log.DEBUG, tag, msg.substring(i, Math.min(length, i + MAX_LOG_LENGTH)));
        }
    }

    abstract class Action {
        abstract void execute(MarketingCloudSdk sdk);

        void err() {}
    }

    abstract class PromiseAction extends Action {
        private final Promise promise;

        PromiseAction(@Nonnull Promise promise) {
            this.promise = promise;
        }

        @Override
        final void execute(MarketingCloudSdk sdk) {
            execute(sdk, promise);
        }

        @Override
        void err() {
            promise.reject("MCSDK-INIT",
                "The MarketingCloudSdk#init method must be called in the Application's onCreate.");
        }

        abstract void execute(MarketingCloudSdk sdk, @NonNull Promise promise);
    }
}