import os

@objc(RNMarketingCloudSdk)
class RNMarketingCloudSdk: RCTEventEmitter, RNMarketingCloudSdkLoggerDelegate {
  
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  override var methodQueue: DispatchQueue! {
    return DispatchQueue.main
  }
  
  var hasListeners: Bool = false
  var verboseLoggingEnabled: Bool = false
  var logger2: RNMarketingCloudSdkLogger?
  
  override func supportedEvents() -> [String]! {
    return ["onLog"]
  }
  
  override func startObserving() {
    self.hasListeners = true
    self.enableLogging()
  }
  
  override func stopObserving() {
    self.hasListeners = false
  }
  
  func enableLogging() {
    if (self.logger2 != nil) {
      return
    }
    
    self.logger2 = RNMarketingCloudSdkLogger()
    self.logger2?.delegate = self;
    
    SFMCSdk.setLogger(logLevel: .debug, logOutputter: self.logger2!)
  }
  
  func log(message: String) {
    os_log("%@", log: .default, type: .default, message)
  }
  
  func onLog(level: LogLevel, subsystem: String, category: LoggerCategory, message: String) {
    if (self.verboseLoggingEnabled) {
      self.log(message: String(format: "%@ - %@", subsystem, message))
    }
    
    if (self.hasListeners) {
      self.sendEvent(withName: "onLog", body: [
        "level": level.rawValue,
        "subsystem": subsystem,
        "category": category.rawValue,
        "message": message
      ])
    }
  }
  
  
  @objc
  func isPushEnabled(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve(SFMCSdk.mp.pushEnabled())
  }
  
  @objc
  func enablePush() {
    SFMCSdk.mp.setPushEnabled(true)
  }
  
  @objc
  func disablePush() {
    SFMCSdk.mp.setPushEnabled(false)
  }
  
  @objc
  func getSystemToken(_ resolve: RCTPromiseResolveBlock, rejecter
                      reject: RCTPromiseRejectBlock) {
    resolve(SFMCSdk.mp.deviceToken())
  }
  
  @objc
  func setSystemToken(_ systemToken: String, resolver resolve
                      : RCTPromiseResolveBlock, rejecter reject
                      : RCTPromiseRejectBlock) {
    do {
      let token = try RNMarketingCloudSdkDeviceToken.init(hexString: systemToken)
      SFMCSdk.mp.setDeviceToken(token.data)
      resolve(true)
    } catch {
      return reject("invalid-hex-token", "Failed to convert token to data type", nil)
    }
  }
  
  @objc
  func getDeviceID( _ resolve
                    : RCTPromiseResolveBlock, rejecter reject
                    : RCTPromiseRejectBlock) {
    resolve(SFMCSdk.mp.deviceIdentifier())
  }
  
  @objc
  func setContactKey(_ contactKey: String) {
    SFMCSdk.identity.setProfileId(contactKey)
  }
  
  @objc
  func getContactKey(_ resolve
                     : RCTPromiseResolveBlock, rejecter reject
                     : RCTPromiseRejectBlock) {
    resolve(SFMCSdk.mp.contactKey())
  }
  
  @objc
  func addTag(_ tag : String, resolver resolve
              : RCTPromiseResolveBlock, rejecter reject
              : RCTPromiseRejectBlock) {
    resolve(SFMCSdk.mp.addTag(tag))
  }
  
  @objc
  func removeTag(_ tag : String, resolver resolve
                 : RCTPromiseResolveBlock, rejecter reject
                 : RCTPromiseRejectBlock) {
    resolve(SFMCSdk.mp.removeTag(tag))
  }
  
  @objc
  func getTags(_ resolve
               : RCTPromiseResolveBlock, rejecter reject
               : RCTPromiseRejectBlock) {
    resolve(Array(arrayLiteral: SFMCSdk.mp.tags()))
  }
  
  @objc
  func setAttribute(_ name: String, value: String) {
    SFMCSdk.identity.setProfileAttribute(name, value)
  }
  
  @objc
  func clearAttribute(_ name: String) {
    SFMCSdk.identity.clearProfileAttribute(key: name)
  }
  
  @objc
  func getAttributes(_ resolve
                     : RCTPromiseResolveBlock, rejecter reject
                     : RCTPromiseRejectBlock) {
    resolve(SFMCSdk.mp.attributes())
  }
  
  @objc
  func enableVerboseLogging() {
    self.enableLogging()
    self.verboseLoggingEnabled = true
  }
  
  @objc
  func logSdkState() {
    self.log(message: SFMCSdk.state())
  }
  
  @objc
  func getSdkState(_ resolve
                   : RCTPromiseResolveBlock, rejecter reject
                   : RCTPromiseRejectBlock) {
    resolve(SFMCSdk.state())
  }
  
  @objc
  func track(_ name: String, attributes: Dictionary<String, Any>) {
    SFMCSdk.track(event: CustomEvent(name: name, attributes: attributes)!)
  }
  
  @objc
  func refresh(_ resolve
               : @escaping RCTPromiseResolveBlock, rejecter reject
               : RCTPromiseRejectBlock) {
    SFMCSdk.mp.refresh { result in
      switch (result) {
      case .noData:
        resolve("throttled");
        break;
        
      case .newData:
        resolve("updated");
        break;
        
      case .failed:
        resolve("failed");
        break;
        
      default:
        resolve("unknown");
      }
    }
  }
}