/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, nativeImage, Tray, Menu, globalShortcut, screen, systemPreferences, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import screenshot from 'screenshot-desktop';
const config = require("dotenv");
config.config();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('log', (event, arg) => {
  type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
  const { level, message, object } = arg;
  if (level in log) {
    (log[level as LogLevel])(message, object);
  } else {
    console.error(`Invalid log level: ${level}`);
  }
});

function showScreenRecordingDialog() {
  const buttonIndex = dialog.showMessageBoxSync({
    type: 'info',
    message: 'Screen Recording Permission',
    detail: 'Our app requires screen recording permission. Please open System Preferences > Security & Privacy > Privacy > Screen Recording and enable the permission for our app.',
    buttons: ['Open System Preferences', 'Later']
  });

  if (buttonIndex === 0) {
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
  }
}

const takeScreenshot = async ({event, dimens}: any) => {
  const primaryDisplay = screen.getPrimaryDisplay()
  let screenDimention = primaryDisplay.size
  const screenWidth = screenDimention.width
  const screenHeight = screenDimention.height

  screenshot({format: 'png'}).then((img: any) => {
    log.info('screenshot taken...', {dimens, screenWidth, screenHeight});
    event.reply('screenshot-captured', {img, dimens, screenWidth, screenHeight});
  }).catch((err: any) => {
    log.error('error taking screenshot: ', err);
    console.log('err: ', err);
  });
}

ipcMain.on('take-screenshot', (event, dimens) => {
  if (process.platform === 'darwin') {
    const status = systemPreferences.getMediaAccessStatus('screen');
    if (status === 'not-determined' || status === 'denied') {
      showScreenRecordingDialog();
    } else {
      takeScreenshot({event, dimens});
    }
  } else if (process.platform === 'win32') {
    takeScreenshot({event, dimens});
  }
})

ipcMain.on('window-resize', (e, width, height, full, toEdges) => {
  const primaryDisplay = screen.getPrimaryDisplay()
  let screenDimention = toEdges ? primaryDisplay.size : primaryDisplay.workAreaSize;
  const w = screenDimention.width
  const h = screenDimention.height

  const x = full ? 0 : Math.round((w - width) / 2);
  const y = full ? 0 : Math.round((h - height) / 2);


  const windowSize = {
    width: full ? w : width,
    height: full ? h : height,
    x,
    y,
  }

  mainWindow && mainWindow.setBounds(windowSize)
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
? path.join(process.resourcesPath, 'assets')
: path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
return path.join(RESOURCES_PATH, ...paths);
};

let tray: Tray | null = null;

const createTray = () => {
  const icon = getAssetPath('icon.png')
  const trayicon = nativeImage.createFromPath(icon)
  tray = new Tray(trayicon.resize({width: 16}))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      accelerator: 'Alt+I',
      click: () => {
        if (mainWindow === null) {
          createWindow()
        } else {
          mainWindow.show()
        }
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    },
    {
      label: `App Version: ${app.getVersion()}`, // Add this line
      enabled: false, // Make it unclickable
    },
  ])

  tray.on('click', () => {
    if (mainWindow === null) {
      createWindow()
    } else {
      mainWindow.show()
    }
  })

  tray.setToolTip('IndigoAI')
  tray.setContextMenu(contextMenu)
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  if(!tray) {
    createTray();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 400,
    transparent: true,
    // vibrancy: 'under-window',
    visualEffectState: 'active',
    darkTheme: true,
    icon: getAssetPath('icon.ico'),// Set the icon here
    // visibleOnAllWorkspaces: true,
    // alwaysOnTop: true,
    // resizable: false,
    frame: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
   // Add the event listener here
   mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key.toLowerCase() === 'escape') {
      // mainWindow && mainWindow.close();
      // mainWindow && mainWindow.hide();
    }
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    console.log('closed event...');

    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // mainWindow.setKiosk(true);

  if (process.platform !== 'darwin') {
    mainWindow.setFullScreen(true);
  }

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.commandLine.appendSwitch('wm-window-animations-disabled');

app.on('window-all-closed', () => {
  console.log('window-all-closed...');

  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    // app.quit();
  } else {
    app.dock.hide()
  }
});

const registerGlobalShortcut = () => {

  const createWindowAndOpenCommands = async  () => {
    if (mainWindow === null) await createWindow()
    console.log('creating window and opening commands...')
    mainWindow?.once('ready-to-show', async () => {
      await mainWindow?.webContents.send('open-route', {route: ''})
      mainWindow?.show();
    })
  }

  const openRoute = async (route: string) => {
    mainWindow && await mainWindow.webContents.send('open-route', {route})
    mainWindow && mainWindow.show();
  }

  const ret = globalShortcut.register('Alt+I', () => {
    if (mainWindow === null) {
      log.info('creating window and opening commands...')
      createWindowAndOpenCommands();
    }
    if (mainWindow !== null) {
      openRoute('');
    }
  })

  if (!ret) {
    console.log('registration failed')
  }

  const createWindowAndOpenChat = async  () => {
    if (mainWindow === null) await createWindow()
    console.log('creating window and opening chat...')
    mainWindow?.once('ready-to-show', () => {
      mainWindow?.webContents.send('open-route', {route: 'open-chat'})
    })
  }

  const chatRet = globalShortcut.register('Alt+Shift+I', () => {
    if (mainWindow === null) {
      createWindowAndOpenChat();
    }
    if (mainWindow !== null) {
      openRoute('open-chat');
    }
  })

  if (!chatRet) {
    console.log('registration for chat global shortcut failed')
  }

  const createWindowAndOpenOverlay = async  () => {
    await createWindow();
    console.log('creating window and opening overlay...')
    mainWindow?.once('ready-to-show', () => {
      mainWindow?.webContents.send('open-route', {route: 'overlay'})
    })
  }

  const overlayRet = globalShortcut.register('Alt+Shift+O', () => {
    if (mainWindow === null) {
      createWindowAndOpenOverlay()
    }
    if (mainWindow !== null) {
      openRoute('overlay');
    }
  })

  if (!overlayRet) {
    console.log('registration for overlay global shortcut failed')
  }
}

// const appFolder = path.dirname(process.execPath)
// const updateExe = path.resolve(appFolder, '..', 'Update.exe')
// const exeName = path.basename(process.execPath)

if (!isDebug) {
  app.setLoginItemSettings({
    openAtLogin: true,
    // openAsHidden: true,
  })
}

app
  .whenReady()
  .then(() => {
    if (app.dock) { // Check if dock is available (macOS)
      app.dock.hide();
    }
    createWindow();
    registerGlobalShortcut();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
