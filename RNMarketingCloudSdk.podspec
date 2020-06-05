require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = "RNMarketingCloudSdk"
  s.version          = package["version"]
  s.description      = package["description"]
  s.summary          = package['description']
  s.homepage         = package['homepage']
  s.license          = package['license']
  s.author           = package['author']
  s.platform         = :ios, "10.0"
  s.source           = { :git => "https://github.com/author/RNMarketingCloudSdk.git", :tag => "master" }
  s.source_files     = "ios/**/*.{h,m}"
  s.requires_arc     = true

  s.dependency       'React'
  s.dependency       'MarketingCloudSDK', '~> 7.2'
  s.static_framework = true
end
