require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = "RNSFMCSdk"
  s.version          = package["version"]
  s.description      = package["description"]
  s.summary          = package['description']
  s.homepage         = package['homepage']
  s.license          = package['license']
  s.author           = package['author']
  s.platform         = :ios, "11.0"
  s.source           = { :git => "https://github.com/salesforce-marketingcloud/react-native-marketingcloudsdk.git", :tag => "master" }
  s.source_files     = "ios/**/*.{h,m}"
  s.requires_arc     = true

  s.dependency       'React'
  s.dependency       'MarketingCloudSDK','~> 9.0.0'
end
