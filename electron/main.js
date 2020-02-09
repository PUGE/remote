// Modules to control application life and create native browser window
const fs = require("fs")
const {app, ipcMain, Menu, BrowserWindow, Tray} = require('electron')
const path = require('path')
const { spawn, execFile } = require('child_process')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray
// 系统托盘

// 读取配置文件
const config = require("./config.json")
if (!config) {
  alert('找不到配置文件!')
  return
}


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
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.on('ready-to-show', function () {
    mainWindow.show() // 初始化后再显示
  })

  // and load the index.html of the app.
  mainWindow.loadURL('http://127.0.0.1:8000/')
  // mainWindow.loadURL(config.home)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // 系统托盘
  tray = new Tray('./resources/image/48.png');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function(){
        app.quit();
      }
    },
    {
      label: '打开开机自启',
      click: function() {
        console.log(config)
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
    const frpPath = process.cwd() + '\\resources\\frpc.exe'
    if (fs.existsSync(frpPath)) {
      let args = [arg.clintType, '-s', config.server, '-l', arg.localPort, '-i', '0.0.0.0']
      if (arg.clintType === 'tcp' || arg.clintType === 'udp') {
        args.push('-r', arg.remotePort)
      }
      child = execFile(frpPath, args, (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          event.returnValue = {err: 1, message: error}
          return
        }
      })
      event.returnValue = {err: 0}
    } else {
      event.returnValue = {err: 1, message: "关键文件不存在!"}
    }
  } else if (arg.type === 'stop') {
    if (child !== null) {
      child.kill()
      child = null
    }
    event.returnValue = {err: 0}
  } else if (arg.type === 'query') {
    event.returnValue = {err: 0, value: child !== null, config}
  }
})
