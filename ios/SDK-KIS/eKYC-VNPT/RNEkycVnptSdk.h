
  #if __has_include("RCTBridgeModule.h")
  #import "RCTBridgeModule.h"
  #else
  #import <React/RCTBridgeModule.h>
  #endif

  @interface RNEkycVnptSdk : NSObject <RCTBridgeModule>
   -(void)showVnptEkycViewController;
  @end

