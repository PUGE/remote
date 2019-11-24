// Modules to control application life and create native browser window
const {app, ipcMain, Menu, BrowserWindow, Tray} = require('electron')
const path = require('path')
const { spawn, execFile } = require('child_process')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray
// 系统托盘


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 320,
    height: 400,
    title: "lamp",
    autoHideMenuBar: true,
    resizable: false,
    skipTaskbar: true,
    icon: "./resources/image/48.png",
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL('https://puge-10017157.cos.ap-shanghai.myqcloud.com/lamp/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // 系统托盘
  tray = new Tray('./resources/image/48.ico');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function(){
        app.quit();
      }
    }
  ]);
  tray.setToolTip('lamp');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.restore()
    mainWindow.focus()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// setTimeout(() => {
//   child.kill()
// }, 5000)

let child = null
ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  
  if (arg.type === 'run') {
    if (child !== null) {
      child.kill()
      child = null
    }
    // console.log(process.cwd())
    child = execFile(process.cwd() + '\\resources\\frpc.exe', [arg.clintType, '-s', 'lamp.run:7000', '-l', arg.localPort, '-i', '0.0.0.0', '-r', arg.remotePort], (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      }
      console.log(stdout);
    })
    event.returnValue = {err: 0}
  } else if (arg.type === 'stop') {
    if (child !== null) {
      child.kill()
      child = null
    }
    event.returnValue = {err: 0}
  } else if (arg.type === 'query') {
    event.returnValue = {err: 0, value: child !== null}
  }
})
