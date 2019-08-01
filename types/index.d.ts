export namespace MCReactPlugin {
function isPushEnabled():Promise<boolean>;
function enablePush():Promise<boolean>;
function disablePush():Promise<boolean>;
function getSystemToken():Promise<string>;
function getAttributes():Promise<Object>;
function setAttribute(key:string, value:string):Promise<boolean>;
function clearAttribute(key:string):Promise<boolean>;
function addTag(tag:string):Promise<boolean>;
function removeTag(tag:string):Promise<boolean>;
function getTags():Promise<Object>;
function setContactKey(contactKey:string):Promise<boolean>;
function getContactKey():Promise<string>;
function enableVerboseLogging():void;
function disableVerboseLogging():void;
function setOnNotificationOpenedListener():void;
function setOnUrlActionListener():void;
function logSdkState():Promise<boolean>;

}