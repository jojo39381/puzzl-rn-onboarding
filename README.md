# puzzl-rn-onboarding

Puzzl onboarding for React Native

## Installation

```sh
npm install puzzl-rn-onboarding
or
yarn add puzzl-rn-onboarding
```

This library contains a postinstall hook to automatically install the following libraries.
Libraries with conflicting versions will automatically be skipped.
If you would like to skip this, include `--ignore-scripts` when adding the package.
Yarn might not show skipped packages when running the postinstall script,
so make sure you have the following dependencies in your package.json if you run into any problems.

```json
"@react-native-community/datetimepicker": "^3.0.0",
"@react-native-community/masked-view": "^0.1.0",
"@react-navigation/native": "^5.5.0",
"@react-navigation/stack": "^5.5.0",
"@veriff/react-native-sdk": "^2.1.0",
"react-native-camera": "^3.0.0",
"react-native-gesture-handler": "^1.3.0",
"react-native-reanimated": "^1.0.0",
"react-native-safe-area-context": "^3.0.0",
"react-native-screens": "^2.0.0",
"react-native-webview": "^10.0.0",
```

#### iOS
* Make your app target iOS 11.0 or higher by adding this line to your Podfile: `platform :ios, '11.0'`
* Include Swift code in your project.
If your project does not already include Swift code, then create a new empty Swift file in the base of your project using Xcode and add the bridging header if Xcode offers.
* Add the following to your Info.plist:
```
<dict>
...
    <key>NSCameraUsageDescription</key>
    <string>Access to camera is needed for user identification purposes</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>Access to microphone is needed for video identification</string>
</dict>
```

#### Android
* Add a new maven destination to the repositories in the `allprojects` section of `build.gradle`:
```
allprojects {
    repositories {
        // ... local react native repos
        maven { url "https://cdn.veriff.me/android/" }
        google()
        jcenter()
    }
}
```

## Usage

This library exports a single component called PuzzlOnboarding with the following props:

```ts
interface OnboardingProps {
  APIKey: string;
  companyID: string;
  employeeID: string;
  onCancel: () => void | Promise<void>;
  onFinished: () => void | Promise<void>;
  onError?: () => void | Promise<void>; // (optional; falls back to onCancel)
  showError?: boolean; // (optional; default: true) Allow the component to display its own error message before cancelling onboarding
  errorMessage?: string; // (optional) Personalize the error message
}
```

```jsx
import PuzzlOnboarding from "puzzl-rn-onboarding";

// ...

<PuzzlOnboarding
  companyID="..."
  APIKey="..."
  employeeID="..."
  onCancel={() => hide()}
  onFinished={() => {
    // Onboarding completed successfully!
    hide()
  }}
/>
```
# puzzl-rn-onboarding
