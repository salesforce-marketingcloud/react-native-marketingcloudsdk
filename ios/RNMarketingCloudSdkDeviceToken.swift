/**
 * When registering a device to push notifications a device token is provided in the
 * form of Data. It is helpful to transform this stream of bytes into a string to 
 * use with HTTP requests and storing with UserDefaults in a human readable way. 
 * This DeviceToken type allows for creating an instance either is with data or a hex 
 * string and then accessing data and hex string properties. 
 * The Swift Playground also includes a series of unit tests which cover the 
 * DeviceToken type completely.
 * @see https://gist.github.com/brennanMKE/d8b68a98aef9c38a3887aace98ecc206
 */
struct RNMarketingCloudSdkDeviceToken {
    enum Failure: Error {
        case invalidHexString
    }
    var data: Data
    var hexString: String {
        let result = data.map { String(format: "%02x", $0) }.joined().uppercased()
        return result
    }

    init(data: Data) {
        self.data = data
    }

    init(hexString: String) throws {
        if hexString.count % 2 != 0 {
            throw Failure.invalidHexString
        }
        let length = 2
        let end = hexString.count/length
        let range = 0..<end
        let transformHex: (Int) -> String = {
            String(hexString.dropFirst($0 * length).prefix(length))
        }
        let transformByte: (String) throws -> UInt8 = {
            guard let value = UInt8($0, radix: 16) else {
                throw Failure.invalidHexString
            }
            return value
        }
        let bytes = try range.map(transformHex).map(transformByte)
        let data = Data(bytes)
        self.data = data
    }
}
