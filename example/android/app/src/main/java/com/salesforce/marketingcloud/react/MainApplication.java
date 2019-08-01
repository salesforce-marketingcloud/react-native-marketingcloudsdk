package com.salesforce.marketingcloud.react;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.salesforce.marketingcloud.MarketingCloudConfig;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        MarketingCloudSdk.init(this,
                MarketingCloudConfig.builder()
                        .setApplicationId("{MC_APP_ID}")
                        .setAccessToken("{MC_ACCESS_TOKEN}")
                        .setSenderId("{FCM_SENDER_ID_FOR_MC_APP}")
                        .setMarketingCloudServerUrl("{MC_APP_SERVER_URL}")
                        .setNotificationCustomizationOptions(NotificationCustomizationOptions.create(R.drawable.ic_notification))
                        .setAnalyticsEnabled(true)
                        .build(this),
                initializationStatus -> Log.e("INIT", initializationStatus.toString()));
    }
}
