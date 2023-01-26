
protocol RNMarketingCloudSdkLoggerDelegate {
  func onLog(level
             : SFMCSDK.LogLevel, subsystem
             : String, category
             : SFMCSDK.LoggerCategory, message
             : String)
}

class RNMarketingCloudSdkLogger : LogOutputter {
  var delegate : RNMarketingCloudSdkLoggerDelegate?
  
  override func out(level
                    : LogLevel, subsystem
                    : String, category
                    : LoggerCategory, message
                    : String) {
    
    self.delegate?.onLog(level
                         : level, subsystem
                         : subsystem, category
                         : category, message
                         : message)
  }
}