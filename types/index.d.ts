export class MCReactPlugin {
    isPushEnabled(): Promise<boolean>;
    enablePush(): void;
    disablePush(): void;
    getSystemToken(): Promise<string>;
    getAttributes(): Promise<Map<string, string>>;
    setAttribute(key: string, value: string): void;
    clearAttribute(key: string): void;
    addTag(tag: string): void;
    removeTag(tag: string): void;
    getTags(): Promise<Array<string>>;
    setContactKey(contactKey: string): void;
    getContactKey(): Promise<string>;
    enableVerboseLogging(): void;
    disableVerboseLogging(): void;
    logSdkState(): void;
  }