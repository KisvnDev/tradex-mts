1. Patches
1) ReactNative no image bug for IOS14
2) JSTimers duration issue.
3) user-inactivity. RCTKeyboardObserver event

patch -p1 -i patches/react-native+0.61.5.patch

npx patch-package react-native

git diff FILENAME > patch

https://jeffgukang.github.io/react-native-tutorial/docs/tips/image-error-ios14.html

https://stackoverflow.com/questions/5159185/create-a-git-patch-from-the-uncommitted-changes-in-the-current-working-directory