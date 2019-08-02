
import {NativeModules} from 'react-native';

const {RNMarketingCloudSdk} = NativeModules;

class MCReactPlugin {
    static isPushEnabled() {
        return RNMarketingCloudSdk.isPushEnabled();
    }

    static enablePush() {
        return RNMarketingCloudSdk.enablePush();
    }

    static disablePush() {
        return RNMarketingCloudSdk.disablePush();
    }

    static getSystemToken() {
        return RNMarketingCloudSdk.getSystemToken();
    }

    static getAttributes() {
        return RNMarketingCloudSdk.getAttributes();
    }

    static setAttribute(key, value) {
        return RNMarketingCloudSdk.setAttribute(key, value);
    }

    static clearAttribute(key) {
        return RNMarketingCloudSdk.clearAttribute(key);
    }

    static addTag(tag) {
        return RNMarketingCloudSdk.addTag(tag);
    }

    static removeTag(tag) {
        return RNMarketingCloudSdk.removeTag(tag);
    }

    static getTags() {
        return RNMarketingCloudSdk.getTags();
    }

    static setContactKey(contactKey) {
        return RNMarketingCloudSdk.setContactKey(contactKey);
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
