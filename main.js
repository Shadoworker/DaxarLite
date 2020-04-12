
const {app, BrowserWindow, webContents, Menu, remote , ipcMain, dialog} = require('electron')

// Module to control application life.
const ipc = ipcMain;
// const _remote = require('electron').remote;

// app.commandLine.appendSwitch('–enable-npapi')


// const BrowserWindow2 = require('electron').remote.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
  let prevWidth = 434;
  let prevHeight = 459;
  let areaWindowConfig = [];
  let cropWidth = 360, cropHeight = 640;

var mainWindow, areaWindow,areaOptsWindow, cropWindow, prewind

function createWindow () {
  // Create the browser window.
  const screen = require('electron').screen;
  const electronScreen = screen;

  const size = electronScreen.getPrimaryDisplay().size;
  


  mainWindow = new BrowserWindow(
    {show:false, 
     minWidth: 768,
     minHeight: 576,
     width:(size.width - 80),
     height:(size.height - 80),
     movable:true,
     resizable:true,
     title:'Daxar',
     icon:'./assets/app_icon.png',
     frame: false,
     webPreferences : {nodeIntegration : true}
    })

  // preload = new BrowserWindow({show:false,parent: mainWindow,width: prevWidth+270, height: prevHeight+40, alwaysOnTop:false,resizable:false,frame: false,transparent:true,modal : true,movable:true});
  cropWindow = new BrowserWindow({title:'CROPPER',show:true,
    x:(size.width-460), y:50, width: size.width, height: size.height,resizable:false,frame: false,
    webPreferences : {nodeIntegration : true}
  });
  //////////// -6 : from areaCrop margins and borders
  areaWindow = new BrowserWindow({title:'AREA',parent: mainWindow,show:false,minWidth: 150,
     minHeight: 150, width: cropWidth, height: cropHeight, alwaysOnTop:true,resizable:true,frame: false,transparent:true,
     webPreferences : {nodeIntegration : true}
    });
  

  areaOptsWindow = new BrowserWindow({title:'BTNS',parent: areaWindow,show:false,minWidth: 10,
     minHeight: 100,width: 45, height: 140, resizable:false,frame: false,
     webPreferences : {nodeIntegration : true}
    });
  
  
  // preload.loadURL(`file://${__dirname}/views/preload.html`)

  cropWindow.loadURL(`file://${__dirname}/views/cropper.html`)
 
  areaWindow.loadURL(`file://${__dirname}/views/area.html`)
  
  areaOptsWindow.loadURL(`file://${__dirname}/views/areaopts.html`)
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/views/index.html`)


   // mainWindow.show();
   // mainWindow.hide();
    
  //Avoiding flash before showing
   mainWindow.once('ready-to-show', () => {
   
      mainWindow.show();
      mainWindow.setContentProtection(true);

      // mainWindow.webContents.send('screen-size', size);
      cropWindow.webContents.send('screen-size', size);
      // areaWindow.hide();

     })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
   // console.log(BrowserWindow.getFocusedWindow())
   // console.log(app)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit();
  })


  
 mainWindow.on('resize' , () =>{
   
   prevWidth = mainWindow.getSize()[0];
   prevHeight = mainWindow.getSize()[1];

 })

 


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)



/////////////////// FUNCTIONS ////////////////////
 
  function _minimize(){
    BrowserWindow.getFocusedWindow().minimize();  
  }

  function _maximize(){
    BrowserWindow.getFocusedWindow().maximize();  
  
  }

  function _reset(){

    BrowserWindow.setSize(prevWidth, prevHeight) ; 
  
  }

  function _close(){
    BrowserWindow.getFocusedWindow().close();  
  }





  // function _showMain(){
  //   mainWindow.show();  
  //   preload.close();
  // }

  // function _showPreload(){
  //   preload.show();  
  //   prewind.close();
  // }


  function _closeAll(){
    app.quit(); 
  }

////////////////////////////////////////////////

ipc.on('minimize-me', () => {_minimize();});
ipc.on('maximize-me', () => {
  
  if (mainWindow.isFullScreen())
   {
    _reset();
   }
   else
   {
    _maximize();
   }
  });


ipc.on('close-me', () => {_close();});
ipc.on('closeAll', () => {_closeAll();});
ipc.on('showPreload', () => {_showPreload();});
ipc.on('showMain', () => {_showMain();});





// Daxar Lite


ipc.on('show-area', (e) =>{

  // Showing Record Area window
  areaWindow.show();
  // areaWindow.setContentProtection(true);

  // Getting area specs in order to place properly option btns window 
  let areaPos = areaWindow.getPosition();
  let areaSize = areaWindow.getSize();
  let x = areaPos[0]+areaSize[0];
  let y = areaPos[1];

  // Showing Record Options window
  areaOptsWindow.setPosition(x, y);
  areaOptsWindow.show();

  mainWindow.hide();

  e.sender.send('area-shown');

  areaWindow.on('resize', ()=>{

    let areaPos = areaWindow.getPosition();
    let areaSize = areaWindow.getSize();
    let x = areaPos[0] + areaSize[0]; // At area window's Right side
    let y = areaPos[1];

    // Make options window to follow the UIArea rect
    areaOptsWindow.setPosition(x, y);
 

  });

  // Make area-opts window to follow area window (when moving)
  areaWindow.on('move', ()=>{

    let areaPos = areaWindow.getPosition();
    let areaSize = areaWindow.getSize();
    let x = areaPos[0]+areaSize[0];
    let y = areaPos[1];

    areaOptsWindow.setPosition(x, y);


  });



});


 
ipc.on('init-stream', (event, arg) => {
  

  console.log("STARTED")

  //Set movable to false(CSS) and ignore events
  areaWindow.webContents.send('start-stream');
  mainWindow.webContents.send('start-stream');
  
  ///Sending cropCanvas stream Positionning and Size details
  let areaPos = areaWindow.getPosition();
  let areaSize = areaWindow.getSize();
  var canvasSpecs = {x : areaPos[0], y: areaPos[1], w : areaSize[0], h : areaSize[1] };
  
  cropWindow.webContents.send('start-stream', canvasSpecs);

  areaWindow.setIgnoreMouseEvents(true);


})





ipc.on('end-stream', function(event){
  
  //
  areaWindow.webContents.send('stop-stream');
  cropWindow.webContents.send('stop-stream');
  areaWindow.setIgnoreMouseEvents(false);
  mainWindow.show();


  ///Getting cropRect for the final video
    let areaPos = areaWindow.getPosition();
    let areaSize = areaWindow.getSize();
    areaWindowConfig[0] = areaPos[0];
    areaWindowConfig[1] = areaPos[1];
    areaWindowConfig[2] = areaSize[0];
    areaWindowConfig[3] = areaSize[1];
    // console.log(areaWindowConfig);

  mainWindow.webContents.send('stop-stream', areaWindowConfig);
  areaWindow.hide();
  areaOptsWindow.hide();
  // areaWindow.setIgnoreMouseEvents(true);


})

 
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
 