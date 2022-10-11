package com.tradex.kisvn;

import android.app.Application;
import android.content.Context;

import java.util.Arrays;
import java.util.List;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.clipboard.ClipboardPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.reactnativerestart.RestartPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;

import com.corbt.keepawake.KCKeepAwakePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnbiometrics.ReactNativeBiometricsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import org.wonday.pdf.RCTPdfView;
import com.burnweb.rnsendintent.RNSendIntentPackage;

import com.tradex.kisvn.ekyc.VnptEkycPackage;

public class MainApplication extends NavigationApplication {

    private final ReactNativeHost mReactNativeHost =
        new NavigationReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }
            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here, for example:
                // packages.add(new MyReactNativePackage());
                // packages.add(new AsyncStoragePackage());
                // packages.add(new ClipboardPackage());
                // packages.add(new CodePush(getString(R.string.CodePushDeploymentKey), getApplicationContext(), getUseDeveloperSupport()));
                // packages.add(new FastImageViewPackage());
                // packages.add(new ImagePickerPackage());
                // packages.add(new ImageResizerPackage());
                // packages.add(new KCKeepAwakePackage());
                // packages.add(new NetInfoPackage());
                // packages.add(new RCTPdfView());
                // packages.add(new ReactNativeBiometricsPackage());
                // packages.add(new ReactNativeOneSignalPackage());
                // packages.add(new ReanimatedPackage());
                // packages.add(new RestartPackage());
                // packages.add(new RNCameraKitPackage());
                // packages.add(new RNCWebViewPackage());
                // packages.add(new RNDateTimePickerPackage());
                // packages.add(new RNDeviceInfo());
                // packages.add(new RNFetchBlobPackage());
                // packages.add(new RNFSPackage());
                // packages.add(new RNGestureHandlerPackage());
                // packages.add(new RNSendIntentPackage());
                // packages.add(new SvgPackage());
                // packages.add(new VectorIconsPackage());
                packages.add(new VnptEkycPackage());
                return packages;
            }
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    // initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }
}
