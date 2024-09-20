// Modules to control application life and create native browser window
const { app, BrowserWindow,Tray, Menu,Notification, nativeImage,ipcMain } = require('electron')
const path = require('node:path')
const fs = require('node:fs');


let mainWindow
let tray = null
let trayIconIntervalId = null
let currentFrequency = 30 //分钟

let currentTime = new Date().getTime(); //获取当前时间戳
let currentAnimal = 'catwhite';
let currentStatus = 'active';
let notice = false;

//获取一个具体文件夹下的所有png图片，返回一个数组
//dir:路径   /resources/icons/
//animal:文件夹名，status:文件夹名
//例如getAnimalPng('dir','cat','idle')返回/resources/icons/cat/idle/文件夹下的所有png图片的完整路径
function getAnimalPng(dir,animal,status) {
  const files = fs.readdirSync(path.join(__dirname, dir+animal+'/'+status));
  //const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png').map(file =>  dir+animal+'/'+status+'/'+file);
  const pngFiles   = files.filter(file => ['.png', '.jpg'].includes(path.extname(file).toLowerCase())).map(file => dir + animal + '/' + status + '/' + file);
  console.log(pngFiles);
  return pngFiles;
}

function notification() {
  new Notification({
    icon:'./resources/icon.png',
    //silent:true,
    title: '起来活动一下',
    body: '你已经坐了'+currentFrequency+'分钟',
    timeoutType: 'never',
    urgency: 'critical'
  }).show();
}


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 260,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.on('close', (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
  mainWindow.webContents.on('did-finish-load', () => {  
    mainWindow.webContents.send('app-version', app.getVersion());
  });
}


//新建一个托盘tray并设置图标轮播，图标来自resources/icons文件夹
//将tray的托盘图标设置为/resources/icons/cat/idle/文件夹下的图片，每秒切换一次
function createTray() {
  const animalPng = getAnimalPng('/resources/icons/',currentAnimal,currentStatus);
  const trayIcon = nativeImage.createFromPath(path.join(__dirname, animalPng[0]));
  tray = new Tray(trayIcon)
  let trayIconIndex = 0
  if (trayIconIntervalId) {
    clearInterval(trayIconIntervalId);
  }
  trayIconIntervalId = setInterval(() => {
    trayIconIndex = (trayIconIndex + 1) % animalPng.length
    const newIcon = nativeImage.createFromPath(path.join(__dirname, animalPng[trayIconIndex]))
    tray.setImage(newIcon)
  }, 150);

  const contextMenu = Menu.buildFromTemplate([
    { label: '重新专注', type: 'normal', 
      click: () => { 
        let t = new Date().getTime();
        if (t-currentTime >= 1000*60*currentFrequency) {
          currentTime = new Date().getTime();
          notice = false;
        }
      }
    },
    { label: '设置频率', type: 'normal', click: () => { mainWindow.show() } },
    { label: '退出', type: 'normal', 
      click: () => { 
        console.log('退出');
        mainWindow.destroy();
        app.quit();
      } 
    }
  ])
  tray.setContextMenu(contextMenu);
  tray.setToolTip('lekeleke-upupup-upupup.')
  tray.on('click', ()=> {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

//修改托盘图标
function changeTrayIcon(animal,status) {
  const animalPng = getAnimalPng('/resources/icons/',animal,status);
  let trayIconIndex = 0
  if (trayIconIntervalId) {
    clearInterval(trayIconIntervalId);
  }
  trayIconIntervalId = setInterval(() => {
    trayIconIndex = (trayIconIndex + 1) % animalPng.length
    const newIcon = nativeImage.createFromPath(path.join(__dirname, animalPng[trayIconIndex]))
    tray.setImage(newIcon)
  }, 150);
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });

  //监控动画变化并更新
  ipcMain.on('change-pet', async function (event, pet) {
    currentAnimal = pet;
    changeTrayIcon(currentAnimal,currentStatus)
  });
  //监控频率变化并更新
  ipcMain.on('change-frequency', async function (event, frequency) {
    currentFrequency = frequency;
  });

  setInterval(() => {
    let t =new Date().getTime(); //获取当前时间戳
    let diff = t - currentTime; //计算时间差
    console.log(diff,currentAnimal,currentFrequency,currentStatus);
    if (diff >= currentFrequency*60*1000) {
      if(currentStatus == 'active' ) {
        changeTrayIcon(currentAnimal,'idle');
        currentStatus = 'idle';
        if (!notice) {
          notification();
          notice = true; //通知一次就够了
        }
      }
    }else{
      if(currentStatus == 'idle') {
        changeTrayIcon(currentAnimal,'active');
        currentStatus = 'active';
      }
    }
  }, 1000);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
