package com.reactnativeupgradeapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;

@ReactModule(name = UpgradeAppModule.NAME)
public class UpgradeAppModule extends ReactContextBaseJavaModule {
    public static final String NAME = "UpgradeApp";
    private final ReactApplicationContext reactContext;

    public UpgradeAppModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void install(final String path, Callback installCallback) {
        try {
            File apkFile = new File(path);
            if (!apkFile.exists()) {
                installCallback.invoke(false, "未找到安装包");
                return;
            }

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            String type = "application/vnd.android.package-archive";
            Uri uri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                uri = FileProvider.getUriForFile(this.reactContext.getCurrentActivity(), this.reactContext.getCurrentActivity().getPackageName() + ".fileProvider", apkFile);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                uri = Uri.fromFile(apkFile);
            }
            intent.setDataAndType(uri, type);
            this.reactContext.getCurrentActivity().startActivity(intent);
            installCallback.invoke(true);
            //关闭当前程序
            // int pid = android.os.Process.myPid();
            // android.os.Process.killProcess(pid);
        } catch (Exception e) {
            installCallback.invoke(false, e.toString());
        }
    }
}
