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
import com.salesforce.marketingcloud.notifications.NotificationManager;
import com.salesforce.marketingcloud.notifications.NotificationMessage;
import com.salesforce.marketingcloud.registration.Registration;
import com.salesforce.marketingcloud.registration.RegistrationManager;

import java.util.*;

import org.json.JSONException;

public class MainApplication extends Application implements ReactApplication, UrlHandler {

  private static final String TAG = "~#MainApplication";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable") List<ReactPackage> packages =
          new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }

    @Override protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    // For DEBUG Builds -- Never release with logging enabled.
    if (BuildConfig.DEBUG) {
      // Turn on VERBOSE Logging
      MarketingCloudSdk.setLogLevel(MCLogListener.VERBOSE);
      MarketingCloudSdk.setLogListener(new MCLogListener.AndroidLogListener());

      // Get the SDK when it's ready
      MarketingCloudSdk.requestSdk(new MarketingCloudSdk.WhenReadyListener() {
        @Override public void ready(MarketingCloudSdk sdk) {
          try {
            // Log the SDK's state when the application is initialized
            Log.i(TAG, "State: " + sdk.getSdkState().toString(2));
          } catch (JSONException e) {
            // NO-OP
          }

          // Register a Registration Listener
          sdk.getRegistrationManager()
              .registerForRegistrationEvents(new RegistrationManager.RegistrationEventListener() {
                @Override public void onRegistrationReceived(Registration registration) {

                  // Output Registration Changes to the Logcat
                  Log.i(TAG, "Registration: " + registration);
                }
              });
        }
      });
    }

    MarketingCloudSdk.init(this, MarketingCloudConfig.builder()
        .setApplicationId(this.getResources().getString(R.string.PUSH_APPLICATION_ID))
        .setAccessToken(this.getResources().getString(R.string.PUSH_ACCESS_TOKEN))
        .setSenderId(this.getResources().getString(R.string.PUSH_SENDER_ID))
        .setMarketingCloudServerUrl(this.getResources().getString(R.string.PUSH_TSE))
        .setNotificationCustomizationOptions(NotificationCustomizationOptions.create(R.drawable.ic_notification,
            new NotificationManager.NotificationLaunchIntentProvider() {
              @Override public PendingIntent getNotificationPendingIntent(Context context,
                  NotificationMessage notificationMessage) {
                if (notificationMessage.url().isEmpty()) {
                  return PendingIntent.getActivity(context, new Random().nextInt(),
                      context.getPackageManager().getLaunchIntentForPackage(context.getPackageName()),
                      PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
                } else {
                  return PendingIntent.getActivity(context, new Random().nextInt(),
                      new Intent(Intent.ACTION_VIEW, Uri.parse(notificationMessage.url())),
                      PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
                }
              }
            }, null))
        .setAnalyticsEnabled(true)
        .setUrlHandler(this)
        .build(this), initializationStatus -> Log.i(TAG, "InitStatus: " + initializationStatus.toString()));
  }

  @Override public PendingIntent handleUrl(Context context, String url, String urlSource) {
    return PendingIntent.getActivity(context, new Random().nextInt(),
        new Intent(Intent.ACTION_VIEW, Uri.parse(url)), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
  }
}
