package com.tradex.kisvn;

import com.imagepicker.permissions.OnImagePickerPermissionsCallback;
import com.facebook.react.modules.core.PermissionListener;

import android.os.Bundle;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity implements OnImagePickerPermissionsCallback{
  private PermissionListener listener;
  /**
    * Returns the name of the main component registered from JavaScript.
    * This is used to schedule rendering of the component.
    */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.launch_screen);
  }

  @Override
  public void setPermissionListener(PermissionListener listener)
  {
    this.listener = listener;
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
  {
    if (listener != null)
    {
      listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
}
