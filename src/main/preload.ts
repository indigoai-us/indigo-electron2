// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channel = 'ipc-example';
export type Chat = 'open-route' | 'sign-in-token';
export type ResizeChannel = 'window-resize' | 'take-screenshot' | 'log';

const electronHandler = {
  environment: process.platform,
  ipcRenderer: {
    sendMessage(channel: Channel, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    send(channel: ResizeChannel, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Chat, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channel, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeListener(channel: Chat, func: (...args: unknown[]) => void) {
      ipcRenderer.removeListener(channel, func);
    },
    onScreenshotCaptured(func: (screenshot: Electron.DesktopCapturerSource) => void) {
      const subscription = (_event: IpcRendererEvent, screenshot: Electron.DesktopCapturerSource) => func(screenshot);
      ipcRenderer.on('screenshot-captured', subscription);
  
      return () => {
        ipcRenderer.removeListener('screenshot-captured', subscription);
      };
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

console.log('preload env var:', process.env.CLERK_PUBLISHABLE_KEY);

contextBridge.exposeInMainWorld('envVars', {
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});

export type ElectronHandler = typeof electronHandler;
