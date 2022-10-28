import { NativeModules } from "react-native";

const { RNMarketingCloudSdk } = NativeModules;

/**
 * @class MCReactModule
 */
class MCReactModule {
  /**
   * The current state of the pushEnabled flag in the native Marketing Cloud
   * SDK.
   * @returns {Promise<boolean>} A promise to the boolean representation of whether push is
   *     enabled.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/messages/push/PushMessageManager.html#isPushEnabled()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_pushEnabled|iOS Docs}
   */
  static isPushEnabled() {
    return RNMarketingCloudSdk.isPushEnabled();
  }

  /**
   * Enables push messaging in the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/messages/push/PushMessageManager.html#enablePush()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_setPushEnabled:|iOS Docs}
   */
  static enablePush() {
    RNMarketingCloudSdk.enablePush();
  }

  /**
   * Disables push messaging in the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/messages/push/PushMessageManager.html#disablePush()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_setPushEnabled:|iOS Docs}
   */
  static disablePush() {
    RNMarketingCloudSdk.disablePush();
  }

  /**
   * Returns the token used by the Marketing Cloud to send push messages to
   * the device.
   * @returns {Promise<?string>} A promise to the system token string.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/messages/push/PushMessageManager.html#getPushToken()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_deviceToken|iOS Docs}
   */
  static getSystemToken() {
    return RNMarketingCloudSdk.getSystemToken();
  }

  /**
   * Returns the maps of attributes set in the registration.
   * @returns {Promise<Object.<string, string>>} A promise to the key/value map of attributes set
   *     in the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.html#getAttributes()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_attributes|iOS Docs}
   */
  static getAttributes() {
    return RNMarketingCloudSdk.getAttributes();
  }

  /**
   * Returns the deviceID used by the Marketing Cloud to send push messages to
   * the device.
   * @returns {Promise<?string>} A promise to the device ID.
   */
  static getDeviceID() {
    return RNMarketingCloudSdk.getDeviceID();
  }

  /**
   * Sets the value of an attribute in the registration.
   * @param  {string} key - The name of the attribute to be set in the
   *     registration.
   * @param  {string} value - The value of the `key` attribute to be set in
   *     the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#setAttribute(java.lang.String,%20java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_setAttributeNamed:value:|iOS Docs}
   */
  static setAttribute(key, value) {
    RNMarketingCloudSdk.setAttribute(key, value);
  }

  /**
   * Clears the value of an attribute in the registration.
   * @param  {string} key - The name of the attribute whose value should be
   *     cleared from the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#clearAttribute(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_clearAttributeNamed:|iOS Docs}
   */
  static clearAttribute(key) {
    RNMarketingCloudSdk.clearAttribute(key);
  }

  /**
   * @param  {string} tag - The tag to be added to the list of tags in the
   *     registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#addTag(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_addTag:|iOS Docs}
   */
  static addTag(tag) {
    RNMarketingCloudSdk.addTag(tag);
  }

  /**
   * @param  {string} tag - The tag to be removed from the list of tags in the
   *     registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#removeTag(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_removeTag:|iOS Docs}
   */
  static removeTag(tag) {
    RNMarketingCloudSdk.removeTag(tag);
  }

  /**
   * Returns the tags currently set on the device.
   * @returns  {Promise<string[]>} A promise to the array of tags currently set in the native SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.html#getTags()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_tags|iOS Docs}
   */
  static getTags() {
    return RNMarketingCloudSdk.getTags();
  }

  /**
   * Sets the contact key for the device's user.
   * @param  {string} contactKey - The value to be set as the contact key of
   *     the device's user.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#setContactKey(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_setContactKey:|iOS Docs}
   */
  static setContactKey(contactKey) {
    RNMarketingCloudSdk.setContactKey(contactKey);
  }

  /**
   * Returns the contact key currently set on the device.
   * @returns  {Promise<?string>} A promise to the current contact key.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.html#getContactKey()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_contactKey|iOS Docs}
   */
  static getContactKey() {
    return RNMarketingCloudSdk.getContactKey();
  }

  /**
   * Enables verbose logging within the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/MarketingCloudSdk.html#setLogLevel(int)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_setDebugLoggingEnabled:|iOS Docs}
   */
  static enableVerboseLogging() {
    RNMarketingCloudSdk.enableVerboseLogging();
  }

  /**
   * Disables verbose logging within the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/MarketingCloudSdk.html#setLogLevel(int)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledoc/Classes/MarketingCloudSDK.html#//api/name/sfmc_setDebugLoggingEnabled:|iOS Docs}
   */
  static disableVerboseLogging() {
    RNMarketingCloudSdk.disableVerboseLogging();
  }

  /**
   * Instructs the native SDK to log the SDK state to the native logging system (Logcat for
   * Android and Xcode/Console.app for iOS).  This content can help diagnose most issues within
   * the SDK and will be requested by the Marketing Cloud support team.
   */
  static logSdkState() {
    RNMarketingCloudSdk.logSdkState();
  }

  /**
   * This method helps to track events, which could result in actions such as an InApp Message being displayed.
   */
  static track(name, attributes) {
    RNMarketingCloudSdk.track(name, attributes);
  }
}

export default MCReactModule;
