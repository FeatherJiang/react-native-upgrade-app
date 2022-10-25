import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
