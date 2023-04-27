import { NativeModules } from "react-native";

const { RNSFMCSdk } = NativeModules;

/**
 * @class MCReactModule
 */
class MCReactModule {
  /**
   * The current state of the pushEnabled flag in the native Marketing Cloud
   * SDK.
   * @returns {Promise<boolean>} A promise to the boolean representation of whether push is
   *     enabled.
   * @see  {@link  https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/is-push-enabled.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)pushEnabled|iOS Docs}
   */
  static isPushEnabled() {
    return RNSFMCSdk.isPushEnabled();
  }

  /**
   * Enables push messaging in the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/enable-push.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)setPushEnabled:|iOS Docs}
   */
  static enablePush() {
    RNSFMCSdk.enablePush();
  }

  /**
   * Disables push messaging in the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.messages.push/-push-message-manager/disable-push.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)setPushEnabled:|iOS Docs}
   */
  static disablePush() {
    RNSFMCSdk.disablePush();
  }

  /**
   * Returns the token used by the Marketing Cloud to send push messages to
   * the device.
   * @returns {Promise<?string>} A promise to the system token string.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-system-token.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)deviceToken|iOS Docs}
   */
  static getSystemToken() {
    return RNSFMCSdk.getSystemToken();
  }

  /**
   * Returns the maps of attributes set in the registration.
   * @returns {Promise<Object.<string, string>>} A promise to the key/value map of attributes set
   *     in the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.html#getAttributes()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)attributes|iOS Docs}
   */
  static getAttributes() {
    return RNSFMCSdk.getAttributes();
  }

  /**
   * Sets the value of an attribute in the registration.
   * @param  {string} key - The name of the attribute to be set in the
   *     registration.
   * @param  {string} value - The value of the `key` attribute to be set in
   *     the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#setAttribute(java.lang.String,%20java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)setProfileAttributes:|iOS Docs}
   */
  static setAttribute(key, value) {
    RNSFMCSdk.setAttribute(key, value);
  }

  /**
   * Clears the value of an attribute in the registration.
   * @param  {string} key - The name of the attribute whose value should be
   *     cleared from the registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#clearAttribute(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)clearProfileAttributeWithKey:|iOS Docs}
   */
  static clearAttribute(key) {
    RNSFMCSdk.clearAttribute(key);
  }

  /**
   * @param  {string} tag - The tag to be added to the list of tags in the
   *     registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#addTag(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)addTag:|iOS Docs}
   */
  static addTag(tag) {
    RNSFMCSdk.addTag(tag);
  }

  /**
   * @param  {string} tag - The tag to be removed from the list of tags in the
   *     registration.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#removeTag(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)removeTag:|iOS Docs}
   */
  static removeTag(tag) {
    RNSFMCSdk.removeTag(tag);
  }

  /**
   * Returns the tags currently set on the device.
   * @returns  {Promise<string[]>} A promise to the array of tags currently set in the native SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.html#getTags()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)tags|iOS Docs}
   */
  static getTags() {
    return RNSFMCSdk.getTags();
  }

  /**
   * Sets the contact key for the device's user.
   * @param  {string} contactKey - The value to be set as the contact key of
   *     the device's user.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.Editor.html#setContactKey(java.lang.String)|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/IDENTITY.html#/c:@M@SFMCSDK@objc(cs)SFMCSdkIDENTITY(im)setProfileId:|iOS Docs}
   */
  static setContactKey(contactKey) {
    RNSFMCSdk.setContactKey(contactKey);
  }

  /**
   * Returns the contact key currently set on the device.
   * @returns  {Promise<?string>} A promise to the current contact key.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/6.0/reference/com/salesforce/marketingcloud/registration/RegistrationManager.html#getContactKey()|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)contactKey|iOS Docs}
   */
  static getContactKey() {
    return RNSFMCSdk.getContactKey();
  }

  /**
   * Enables verbose logging within the native Marketing Cloud SDK and Unified SFMC SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/trouble-shooting/loginterface.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SFMCSdk.html#/c:@M@SFMCSDK@objc(cs)SFMCSdk(cm)setLoggerWithLogLevel:logOutputter:|iOS Docs}
   */
  static enableLogging() {
    RNSFMCSdk.enableLogging();
  }

  /**
   * Disables verbose logging within the native Marketing Cloud SDK.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/trouble-shooting/loginterface.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/SFMCSdk/8.0/Classes/SFMCSdk.html#/c:@M@SFMCSDK@objc(cs)SFMCSdk(cm)setLoggerWithLogLevel:logOutputter:|iOS Docs}

   */
  static disableLogging() {
    RNSFMCSdk.disableLogging();
  }

  /**
   * Instructs the native SDK to log the SDK state to the native logging system (Logcat for
   * Android and Xcode/Console.app for iOS).  This content can help diagnose most issues within
   * the SDK and will be requested by the Marketing Cloud support team.
   */
  static logSdkState() {
    RNSFMCSdk.logSdkState();
  }

  /**
   * This method helps to track events, which could result in actions such as an InApp Message being displayed.
   */
  static track(name, attributes) {
    RNSFMCSdk.track(name, attributes);
  }

  /**
   * Returns the deviceId used by the Marketing Cloud to send push messages to the device.
   * @returns {Promise<?string>} A promise to the device Id.
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/javadocs/MarketingCloudSdk/8.0/com.salesforce.marketingcloud.registration/-registration-manager/get-device-id.html|Android Docs}
   * @see  {@link https://salesforce-marketingcloud.github.io/MarketingCloudSDK-iOS/appledocs/MarketingCloudSdk/8.0/Classes/PushModule.html#/c:@M@MarketingCloudSDK@objc(cs)SFMCSdkPushModule(im)deviceIdentifier|iOS Docs}
   */
  static getDeviceId() {
    return RNSFMCSdk.getDeviceId();
  }
}

export default MCReactModule;
