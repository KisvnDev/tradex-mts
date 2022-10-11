#if !TARGET_IPHONE_SIMULATOR
#import "RNEkycVnptSdk.h"
#endif
#import <FinalSDK/FinalSDK.h>
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "AppDelegate.h"

@interface RNEkycVnptSdk()
@property(nonatomic, retain) RCTPromiseResolveBlock _resolve;
@property(nonatomic, retain) RCTPromiseRejectBlock _reject;
@end

@implementation RNEkycVnptSdk

RCT_EXPORT_MODULE(RNEkycVnptSdk)

RCT_EXPORT_METHOD(initVnptEkyc:(NSString*)type :(NSString*)lang resoler:(RCTPromiseResolveBlock)resole rejecter:(RCTPromiseRejectBlock)reject){
dispatch_sync(dispatch_get_main_queue(), ^{
  self._resolve = resole;
  self._reject = reject;

  // self._resolve(@"result from sdk ios");
  // self._reject(@"EKYC_VNPT_SDK_CANCELLED", @"Cancelled", nil);
  [self showVnptEkycViewController:type :lang];
});
}

-(void) showVnptEkycViewController: (NSString*)type :(NSString*)lang {
//RCTLog(@"chuan bi call sang ekyc vnpt");
#if !TARGET_IPHONE_SIMULATOR
[self initParamSdk];

UIViewController *root = [[[UIApplication sharedApplication] delegate] window].rootViewController;
BOOL modalPresent = (BOOL) (root.presentedViewController);

 if([type isEqualToString:@"0"]){
   RCTLog(@"call type 0");
   CameraViewController *objCamera = (CameraViewController *)[CameraRouter createModule];
    objCamera.isVersion = VersionSdkPro;
    objCamera.flowType = FlowTypeFull;
    objCamera.isType = TypeDocumentCmt;
    objCamera.cameraDelegate = self;
    objCamera.stepNow = ProgessStepStepFront;
    objCamera.isShowTrademark = false;
          
    objCamera.unitCustomer = @"VNPTPAY";
    objCamera.challengeCode = @"INNOVATIONCENTER_IOS_PRO";
          
    objCamera.isShowResult = NO;
    objCamera.isShowHelp = YES;
    objCamera.logoTrademarkName = @"KIS"; //
    objCamera.isCheckLivenessCard = YES; // "Không(cơ bản) && Có(nâng cao)"
    objCamera.isCheckMaskFace = YES; //
    objCamera.isAddFace = YES; //
    objCamera.languageApplication = lang;
   objCamera.isSkipVoiceVideo = YES;
//   objCamera.buttonReTakeColor = [UIColor colorWithRed: 0.15 green: 0.41 blue: 0.69 alpha: 1.00];
//   objCamera.buttonBackgroundColor = [UIColor colorWithRed: 0.15 green: 0.41 blue: 0.69 alpha: 1.00];
    objCamera.modalPresentationStyle = UIModalPresentationOverFullScreen;
        
    [root showDetailViewController:objCamera sender:nil];
 }else{
   RCTLog(@"call type 2");
   CameraViewController *objCamera = (CameraViewController *)[CameraRouter createModule];
   objCamera.cameraDelegate = self;
   objCamera.isVersion = VersionSdkPro;
   objCamera.isShowResult = NO;
   objCamera.stepNow = ProgessStepStepFront;
   objCamera.logoTrademarkName = @"KIS";
   objCamera.isShowTrademark = false;
   objCamera.unitCustomer = @"VNPTPAY";
   objCamera.challengeCode = @"INNOVATIONCENTER_IOS_PRO";
   if([type isEqualToString:@"1"]){
     objCamera.isType = TypeDocumentCmt;
   }else if([type isEqualToString:@"2"]){
     objCamera.isType = TypeDocumentHochieu;
   }else if([type isEqualToString:@"3"]){
     objCamera.isType = TypeDocumentCmtquandoi;
   }else{
     objCamera.isType = TypeDocumentCmt;
   }
   objCamera.modalPresentationStyle = UIModalPresentationFullScreen;
   objCamera.flowType = FlowTypeFull;
   objCamera.isShowHelp = true;
   objCamera.languageApplication = lang;
  objCamera.isSkipVoiceVideo = YES;
//  objCamera.buttonReTakeColor = [UIColor colorWithRed: 0.15 green: 0.41 blue: 0.69 alpha: 1.00];
//  objCamera.buttonBackgroundColor = [UIColor colorWithRed: 0.15 green: 0.41 blue: 0.69 alpha: 1.00];
   if(modalPresent){
     UIViewController *parent = root.presentedViewController;
     [parent showViewController:objCamera sender:parent];
   }else{
     [root showDetailViewController:objCamera sender:root];
   }
 }
#endif
}

-(void) initParamSdk{
#if !TARGET_IPHONE_SIMULATOR
SaveData.shared.SDTokenKey = @"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJn+UqSUGKre5hEzgw0w95LdKXpbcjPTggz7Aaw5AJXWqTPgZRK5dT4/S7kbIgvm7FNbYGXAgEbhydsdFAMU7/kCAwEAAQ==";
SaveData.shared.SDTokenId = @"c3c513a9-4582-b2fe-e053-604fc10a24b1";
SaveData.shared.SDAuthorization = @"bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0N2M5YTU3Mi03Njg0LTExZWItOGUyZi0yNTQ5ZDNmNGY0YzIiLCJhdWQiOlsicmVzdHNlcnZpY2UiXSwidXNlcl9uYW1lIjoicWxzcGljQGlkZy52bnB0LnZuIiwic2NvcGUiOlsicmVhZCJdLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdCIsIm5hbWUiOiJxbHNwaWNAaWRnLnZucHQudm4iLCJ1dWlkX2FjY291bnQiOiI0N2M5YTU3Mi03Njg0LTExZWItOGUyZi0yNTQ5ZDNmNGY0YzIiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6Ijk2YzJmZjVlLTBkMDAtNDkzOS05YmRmLWM3NzkxOGFmZjUwOSIsImNsaWVudF9pZCI6ImFkbWluYXBwIn0.gWZkI5CqWgwcs9JOcQ4PPLjKUIZUxjtqIXl5ADti-AGej80XGfZIejTEWiMBRaKtOrQxmqu6YjQPe5xcg7onnK9uH0n4hkeRyGBlzixL4rEXH2CieegENjUFAjv6bAi-ahZwHxd5p5I6dNbh6kdYfzAH2YKFiTP5ElAfk2aliOqDMDjmQjYeIx8h05Jwl6Z9y1aIdme_iLfGzgNk9dyhhDoVtsGV3_mqd_f0qPGtOOo1TM9o7zsd9myNUudnPQlE0GvW6Fo8SEkHOgsfgfuzcsBYO__XuGCs0AtCjTt9srwMzASIg20CBCh3b_vLpSLDDoMTUqHGKHx1lColfWaRpA";
#endif
}


#pragma mark - VNPT EKYC Delegate
-(void) getResult{
[self dismissViewController];
  [self sentCallback];
}

-(void) dismissViewController{
AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.inputViewController dismissViewControllerAnimated:YES completion:^{
//  [self sentCallback];
}];
}

-(void) sentCallback{
#if !TARGET_IPHONE_SIMULATOR
NSString* timeoutJson = [NSString stringWithFormat:@"%@",SaveData.shared.networkProblem];
NSString* infoJson = [NSString stringWithFormat:@"%@",SaveData.shared.jsonInfo];
NSString* compareJson = [NSString stringWithFormat:@"%@",SaveData.shared.jsonCompareFace];
NSString* maskedFaceJson = [NSString stringWithFormat:@"%@", SaveData.shared.jsonCheckMask];
 
NSString* imageFront = [self encodeToBase64String: SaveData.shared.imageFront typeImage: @"IMAGE_FRONT"];
NSString* imageBack = [self encodeToBase64String: SaveData.shared.imageBack typeImage: @"IMAGE_BACK"];
NSString* imageFace = [self encodeToBase64String: SaveData.shared.imageFace typeImage:@"IMAGE_FACE"];

// RCTLog(@"infoJson data ekyc: %@", infoJson);
// RCTLog(@"compare data ekyc: %@", compareJson);
// RCTLog(@"liveness data ekyc: %@", livenessJson);
  RCTLog(@"front: %@", imageFront);
  RCTLog(@"back: %@", imageBack);
  RCTLog(@"face: %@", imageFace);
  if(imageBack == nil){
    imageBack = @"";
  }
if(![timeoutJson isEqualToString: @""]){
  infoJson = @"";
  compareJson = @"";
//  livenessJson = @"";
  maskedFaceJson = @"";
  timeoutJson = @"timeout";
}else{
  timeoutJson = @"";
}
  
NSDictionary *dict=@{@"info" : infoJson, @"compare" : compareJson, @"maskedface" : maskedFaceJson, @"liveness" : @"", @"network": timeoutJson, @"imageFront": imageFront, @"imageBack": imageBack, @"imageFace": imageFace};
//  NSDictionary *dict=@{@"info" : infoJson, @"compare" : compareJson, @"maskedface" : maskedFaceJson, @"liveness" : @"", @"network": timeoutJson};
  NSError *error;
  NSData *  data= [NSJSONSerialization dataWithJSONObject:dict options:0 error:&error];

  if (error)
      NSLog(@"Failure to serialize JSON object %@", error);
   
  NSString *resultJson = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

// NSString* resultJson = [NSString stringWithFormat: @"{\"info\":%@ ,\"compare\": %@, \"maskedface\": %@, \"imageFront\": %@, \"imageBack\": %@, \"imageFace\": %@ }", infoJson, compareJson, maskedFaceJson,  memay, imageBack, imageFace];

self._resolve(resultJson);
#endif
}

- (NSString *)encodeToBase64String:(UIImage *)image typeImage: (NSString *)type {
 CGFloat width = image.size.width * 0.5;
 CGFloat height = image.size.height * 0.5;
 CGFloat quality = 0.5;
 UIImage* uiImageResize;
 NSUInteger sizeKb = 100;
 NSString* dataString;
 
//   if([type isEqualToString:@"IMAGE_FACE"]){
    image = [self resizeWithUImage:image convertToSize:CGSizeMake(width, height)];
//   }

 while(sizeKb > 50){
   @autoreleasepool {
     //     uiImageResize = [self resizeWithUImage:image convertToSize:CGSizeMake(width, height)];
          dataString = [UIImageJPEGRepresentation(image, quality) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
          sizeKb = [dataString lengthOfBytesUsingEncoding:NSUTF8StringEncoding]/1024;
     //     NSLog(@"%i bytes", sizeKb);
     
          quality = quality - 0.1;
        }
   }
 
 return dataString;
}

- (UIImage *)resizeWithUImage:(UIImage *)image convertToSize:(CGSize)size {
  UIGraphicsBeginImageContext(size);
  [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
  UIImage *destImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return destImage;
}


@end
