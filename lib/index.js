
import {NativeModules} from 'react-native';

const {RNMarketingCloudSdk} = NativeModules;

class MCReactPlugin {
    static isPushEnabled() {
        return RNMarketingCloudSdk.isPushEnabled();
    }

    static enablePush() {
        RNMarketingCloudSdk.enablePush();
    }

    static disablePush() {
        RNMarketingCloudSdk.disablePush();
    }

    static getSystemToken() {
        return RNMarketingCloudSdk.getSystemToken();
    }

    static getAttributes() {
        return RNMarketingCloudSdk.getAttributes();
    }

    static setAttribute(key, value) {
        RNMarketingCloudSdk.setAttribute(key, value);
    }

    static clearAttribute(key) {
        RNMarketingCloudSdk.clearAttribute(key);
    }

    static addTag(tag) {
        RNMarketingCloudSdk.addTag(tag);
    }

    static removeTag(tag) {
        RNMarketingCloudSdk.removeTag(tag);
    }

    static getTags() {
        return RNMarketingCloudSdk.getTags();
    }

    static setContactKey(contactKey) {
        RNMarketingCloudSdk.setContactKey(contactKey);
    }

    static getContactKey() {
        return RNMarketingCloudSdk.getContactKey();
    }

    static enableVerboseLogging() {
        RNMarketingCloudSdk.enableVerboseLogging();
    }

    static disableVerboseLogging() {
        RNMarketingCloudSdk.disableVerboseLogging();
    }

    static logSdkState() {
        RNMarketingCloudSdk.logSdkState();
    }
}

export default MCReactPlugin;
