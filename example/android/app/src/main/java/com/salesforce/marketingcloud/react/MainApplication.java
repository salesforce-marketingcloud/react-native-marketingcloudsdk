package com.salesforce.marketingcloud.react;

import android.app.Application;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.salesforce.marketingcloud.MarketingCloudConfig;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.MCLogListener;
import com.salesforce.marketingcloud.UrlHandler;
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions;
import java.util.*;

public class MainApplication extends Application implements ReactApplication, UrlHandler {

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

        if (BuildConfig.DEBUG) {
            MarketingCloudSdk.setLogLevel(MCLogListener.VERBOSE);
            MarketingCloudSdk.setLogListener(new MCLogListener.AndroidLogListener());    
        }
  
        MarketingCloudSdk.init(this,
                MarketingCloudConfig.builder()
                        .setApplicationId(this.getResources().getString(R.string.PUSH_APPLICATION_ID))
                        .setAccessToken(this.getResources().getString(R.string.PUSH_ACCESS_TOKEN))
                        .setSenderId(this.getResources().getString(R.string.PUSH_SENDER_ID))
                        .setMarketingCloudServerUrl(this.getResources().getString(R.string.PUSH_TSE))
                        .setNotificationCustomizationOptions(NotificationCustomizationOptions.create(R.drawable.ic_notification))
                        .setAnalyticsEnabled(true)
                        .setUrlHandler(this)
                        .build(this),
                initializationStatus -> Log.i("~#MainApplication", initializationStatus.toString()));
    }

    @Override
    public PendingIntent handleUrl(Context context, String url, String urlSource) {
        return PendingIntent.getActivity(
          context,
          new Random().nextInt(),
          new Intent(Intent.ACTION_VIEW, Uri.parse(url)),
          PendingIntent.FLAG_UPDATE_CURRENT
        );
      }
        
}
