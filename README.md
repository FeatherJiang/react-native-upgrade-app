# react-native-upgrade-app

react native upgrade app

## Installation

```sh
yarn add react-native-upgrade-app
```

## Installing dependencies

```sh
yarn add react-native-fs
```

## Usage

### API

`upgrade(config: UpgradeConfig)`

```javascript
type UpgradeConfig = {
  fromUrl: string;          // URL to download file from
  headers?: Headers;        // An object of headers to be passed to the server
  background?: boolean;     // Continue the download in the background after the app terminates (iOS only)
  discretionary?: boolean;  // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
  cacheable?: boolean;      // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)
  progressInterval?: number;
  progressDivider?: number;
  begin?: (res: DownloadBeginCallbackResult) => void; // Note: it is required when progress prop provided
  progress?: (res: DownloadProgressCallbackResult) => void;
  resumable?: () => void;    // only supported on iOS yet
  connectionTimeout?: number // only supported on Android yet
  readTimeout?: number       // supported on Android and iOS
  backgroundTimeout?: number // Maximum time (in milliseconds) to download an entire resource (iOS only, useful for timing out background downloads)
  downloadFinish?: (success: boolean) => void; // download finish callback
  install?: boolean; // is install
  installCallback?: (success: boolean, msg?: string) => void; // install callback
  onError?: (error: unknown) => void; // error callback
};
```

### Example

```js
import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { upgrade } from 'react-native-upgrade-app';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 200,
    height: 100,
    backgroundColor: 'red',
  },
});

function App() {
  const [progress, setProgress] = useState(0);
  const update = () => {
    // 请替换为一个可用的url
    // Please replace with an available url
    if (Platform.OS === 'android') {
      upgrade({
        fromUrl: 'https://example.com/example.apk',
        progress: (res) => {
          console.log('progress', res);
          setProgress(Math.ceil((res.bytesWritten / res.contentLength) * 100));
        },
        downloadFinish: (success) => {
          console.log('finish', success);
        },
        installCallback: (status, msg) => {
          console.log('install', status, msg);
        },
        onError: (error) => {
          console.log('error', error);
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={update}>
        <Text>升级</Text>
      </TouchableOpacity>
      <Text>进度：{progress}%</Text>
    </View>
  );
}

export default App;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
