package com.salesforce.marketingcloud.react;

import android.app.Application;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.example.ReactNativeFlipper;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.salesforce.marketingcloud.MarketingCloudConfig;
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions;
import com.salesforce.marketingcloud.notifications.NotificationManager;
import com.salesforce.marketingcloud.notifications.NotificationMessage;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdkModuleConfig;
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogLevel;
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogListener;

import java.util.List;
import java.util.Random;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable") List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
            return BuildConfig.IS_HERMES_ENABLED;
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
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        SFMCSdk.configure((Context) this, SFMCSdkModuleConfig.build(builder -> {
            builder.setPushModuleConfig(MarketingCloudConfig.builder().setApplicationId(this.getResources().getString(R.string.PUSH_APPLICATION_ID)).setAccessToken(this.getResources().getString(R.string.PUSH_ACCESS_TOKEN)).setSenderId(this.getResources().getString(R.string.PUSH_SENDER_ID)).setMarketingCloudServerUrl(this.getResources().getString(R.string.PUSH_TSE)).setNotificationCustomizationOptions(NotificationCustomizationOptions.create((context, notificationMessage) -> {
                String channelId = NotificationManager.createDefaultNotificationChannel(context);
                NotificationCompat.Builder defaultNotificationBuilder = NotificationManager.getDefaultNotificationBuilder(context, notificationMessage, channelId, R.mipmap.ic_launcher);
                defaultNotificationBuilder.setContentIntent(NotificationManager.redirectIntentForAnalytics(context, getPendingIntent(context, notificationMessage), notificationMessage, true));
                return defaultNotificationBuilder;
            })).setUrlHandler((context, s, s1) -> PendingIntent.getActivity(context, new Random().nextInt(), new Intent(Intent.ACTION_VIEW, Uri.parse(s)), provideIntentFlags()

            )).setAnalyticsEnabled(true).build(this));

            return null;
        }), initializationStatus -> {
            Log.e("TAG", "STATUS " + initializationStatus);
            if (initializationStatus.getStatus() == 1) {
                Log.e("TAG", "STATUS SUCCESS");
            }
            return null;
        });
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }

    private PendingIntent getPendingIntent(Context context, NotificationMessage notificationMessage) {
        if (TextUtils.isEmpty(notificationMessage.url())) {
            return PendingIntent.getActivity(context, new Random().nextInt(), context.getPackageManager().getLaunchIntentForPackage(context.getPackageName()), provideIntentFlags());
        } else {
            return PendingIntent.getActivity(context, new Random().nextInt(), new Intent(Intent.ACTION_VIEW, Uri.parse(notificationMessage.url())), provideIntentFlags());
        }
    }

    private int provideIntentFlags() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        } else {
            return PendingIntent.FLAG_UPDATE_CURRENT;
        }
    }
}
