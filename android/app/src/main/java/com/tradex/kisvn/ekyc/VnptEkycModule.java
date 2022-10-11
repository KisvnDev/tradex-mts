package com.tradex.kisvn.ekyc;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Build;
import android.widget.Toast;

import com.google.gson.Gson;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.JsonObject;
import com.vnptit.idg.sdk.activity.VnptIdentityActivity;
import com.vnptit.idg.sdk.utils.SDKEnum;

import java.util.Locale;

import static android.app.Activity.RESULT_OK;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.ACCESS_TOKEN;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CALL_ADD_FACE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CAMERA_FOR_PORTRAIT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CHECK_LIVENESS_CARD;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CHECK_MASKED_FACE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.DOCUMENT_TYPE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.ENABLE_GOT_IT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.HIDE_TRADE_MARK;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.LANGUAGE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.LIVENESS_ADVANCED;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SELECT_DOCUMENT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SHOW_DIALOG_SUPPORT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SHOW_RESULT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SHOW_SWITCH;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.TOKEN_ID;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.TOKEN_KEY;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.VERSION_SDK;
import static com.vnptit.idg.sdk.utils.KeyResultConstants.INFO_RESULT;
import static com.vnptit.idg.sdk.utils.KeyResultConstants.FRONT_IMAGE;
import static com.vnptit.idg.sdk.utils.KeyResultConstants.REAR_IMAGE;
import static com.vnptit.idg.sdk.utils.KeyResultConstants.PORTRAIT_IMAGE;
import static com.vnptit.idg.sdk.utils.KeyResultConstants.COMPARE_RESULT;
public class VnptEkycModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final String CHANGE_LANGUAGE_IN_SDK = "CHANGE_LANGUAGE_IN_SDK";
    private final ReactApplicationContext reactContext;

    public VnptEkycModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    private Callback mCallback;

    @Override
    public String getName() {
        return "VnptEkyc";
    }

    /**
     function change language
     @param language: "vi"/"en"
     */
    private void reloadLanguage(String language) {
        Locale locale = new Locale(language);
        Configuration config = new Configuration();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            config.setLocale(locale);
        } else {
            config.locale = locale;
        }
        reactContext.getBaseContext().getResources().updateConfiguration(config,
                reactContext.getBaseContext().getResources().getDisplayMetrics());
    }

    @ReactMethod
    public void ekyc(String stringArgument,String lang, Callback callback) {
        // TODO: Implement some actually useful functionality
        mCallback = callback;
        String langType;
        if(lang.equals("vi")){
            langType =  SDKEnum.LanguageEnum.VIETNAMESE.getValue();
        } else {
            langType = SDKEnum.LanguageEnum.ENGLISH.getValue();
        }
        reloadLanguage(langType);
        openEKYC(stringArgument,lang);
    }

    private void openEKYC(String stringArgument, String lang) {
        Intent intent = new Intent(reactContext.getCurrentActivity(), VnptIdentityActivity.class);
         int documentType;
               if(stringArgument.equals("ID")){
                     documentType = SDKEnum.DocumentTypeEnum.IDENTITY_CARD.getValue();
                } else {
                     documentType = SDKEnum.DocumentTypeEnum.PASSPORT.getValue();
                }
               String langType;
                       if(lang.equals("vi")){
                           langType =  SDKEnum.LanguageEnum.VIETNAMESE.getValue();
                       } else {
                           langType = SDKEnum.LanguageEnum.ENGLISH.getValue();
                       }

        if (intent != null) {
            intent.putExtra(ACCESS_TOKEN, "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0N2M5YTU3Mi03Njg0LTExZWItOGUyZi0yNTQ5ZDNmNGY0YzIiLCJhdWQiOlsicmVzdHNlcnZpY2UiXSwidXNlcl9uYW1lIjoicWxzcGljQGlkZy52bnB0LnZuIiwic2NvcGUiOlsicmVhZCJdLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdCIsIm5hbWUiOiJxbHNwaWNAaWRnLnZucHQudm4iLCJ1dWlkX2FjY291bnQiOiI0N2M5YTU3Mi03Njg0LTExZWItOGUyZi0yNTQ5ZDNmNGY0YzIiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6Ijk2YzJmZjVlLTBkMDAtNDkzOS05YmRmLWM3NzkxOGFmZjUwOSIsImNsaWVudF9pZCI6ImFkbWluYXBwIn0.gWZkI5CqWgwcs9JOcQ4PPLjKUIZUxjtqIXl5ADti-AGej80XGfZIejTEWiMBRaKtOrQxmqu6YjQPe5xcg7onnK9uH0n4hkeRyGBlzixL4rEXH2CieegENjUFAjv6bAi-ahZwHxd5p5I6dNbh6kdYfzAH2YKFiTP5ElAfk2aliOqDMDjmQjYeIx8h05Jwl6Z9y1aIdme_iLfGzgNk9dyhhDoVtsGV3_mqd_f0qPGtOOo1TM9o7zsd9myNUudnPQlE0GvW6Fo8SEkHOgsfgfuzcsBYO__XuGCs0AtCjTt9srwMzASIg20CBCh3b_vLpSLDDoMTUqHGKHx1lColfWaRpA");
            intent.putExtra(TOKEN_ID, "c3c513a9-4582-b2fe-e053-604fc10a24b1");
            intent.putExtra(TOKEN_KEY, "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJn+UqSUGKre5hEzgw0w95LdKXpbcjPTggz7Aaw5AJXWqTPgZRK5dT4/S7kbIgvm7FNbYGXAgEbhydsdFAMU7/kCAwEAAQ==");
            intent.putExtra(DOCUMENT_TYPE, documentType);
            intent.putExtra(SELECT_DOCUMENT, false);
            intent.putExtra(VERSION_SDK, SDKEnum.VersionSDKEnum.ADVANCED.getValue());
            intent.putExtra(SHOW_RESULT, false);
            intent.putExtra(SHOW_DIALOG_SUPPORT, true);
            intent.putExtra(CAMERA_FOR_PORTRAIT, SDKEnum.CameraTypeEnum.FRONT.getValue());
            intent.putExtra(SHOW_SWITCH, false);
            intent.putExtra(HIDE_TRADE_MARK, true);
            intent.putExtra(ENABLE_GOT_IT, true);
            intent.putExtra(CALL_ADD_FACE, false);
            intent.putExtra(LIVENESS_ADVANCED, true);
            intent.putExtra(CHECK_MASKED_FACE,true);
            intent.putExtra(CHECK_LIVENESS_CARD,true);
            intent.putExtra(CHANGE_LANGUAGE_IN_SDK, true);
            intent.putExtra(LANGUAGE, langType);
            reactContext.getCurrentActivity().startActivityForResult(intent, 1);
        }
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Toast.makeText(activity, "show", Toast.LENGTH_SHORT).show();
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                String strDataInfo = data.getStringExtra(INFO_RESULT);
                String imageFront = data.getStringExtra(FRONT_IMAGE);
                String imageRear = data.getStringExtra(REAR_IMAGE);
                String imagePortrait = data.getStringExtra(PORTRAIT_IMAGE);
                String faceResult = data.getStringExtra(COMPARE_RESULT);
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(strDataInfo, JsonObject.class);
                jsonObject.addProperty("imgFront", imageFront); 
                jsonObject.addProperty("imgRear", imageRear); 
                jsonObject.addProperty("imagePortrait", imagePortrait); 
                jsonObject.addProperty("faceResult", faceResult); 
                mCallback.invoke(jsonObject.toString());
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}