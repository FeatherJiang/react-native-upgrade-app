import { NativeModules, Platform } from 'react-native';
import RNFS, {
  downloadFile,
  exists,
  unlink,
  DownloadFileOptions,
} from 'react-native-fs';

const DownloadFilePath = RNFS.DocumentDirectoryPath + '/tmp.apk';

const LINKING_ERROR =
  `The package 'react-native-upgrade-app' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const UpgradeApp = NativeModules.UpgradeApp
  ? NativeModules.UpgradeApp
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

type UpgradeConfig = Omit<DownloadFileOptions, 'toFile'> & {
  downloadFinish?: (success: boolean) => void;
  install?: boolean;
  installCallback?: (success: boolean, msg?: string) => void;
  onError?: (error: unknown) => void;
};

export async function upgrade(config: UpgradeConfig): Promise<void> {
  const {
    install = true,
    downloadFinish = () => {},
    installCallback,
    onError,
  } = config;
  const downloadOptions = {
    progressInterval: 200,
    ...config,
    toFile: DownloadFilePath,
  };
  try {
    const isExists = await exists(DownloadFilePath);
    if (isExists) {
      await unlink(DownloadFilePath);
    }
    const downloadHandle = downloadFile(downloadOptions);
    const downloadRes = await downloadHandle.promise;
    if (downloadRes.statusCode === 200) {
      downloadFinish(true);
    } else {
      downloadFinish(false);
      throw { error: '下载失败', info: downloadRes };
    }
    if (install) {
      UpgradeApp.install(downloadOptions.toFile, installCallback);
    }
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
}
