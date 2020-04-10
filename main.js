
const {app, BrowserWindow, ipcMain} = require('electron')

// Module to control application life.
const ipc = ipcMain;
 
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
  let areaWindowConfig = [];
  let cropWidth = 360, cropHeight = 640;

var mainWindow

function createWindow () {
  // Create the browser window.
  const screen = require('electron').screen;
  const electronScreen = screen;

  const size = electronScreen.getPrimaryDisplay().size;
  


  mainWindow = new BrowserWindow(
    {
      show:false, 
      minWidth: 768,
      minHeight: 576,
      width:(size.width - 80),
      height:(size.height - 80),
      movable:true,
      resizable:true,
      title:'Daxar',
      icon:'./assets/app_icon.png',
      frame: false,
      webPreferences : 
      {
        nodeIntegration : true
      }
    })
 
  //////////// -6 : from areaCrop margins and borders
  areaWindow = new BrowserWindow({title:'daxar-area',parent: mainWindow,show:false,minWidth: 150,
     minHeight: 150, width: cropWidth, height: cropHeight, alwaysOnTop:true,resizable:true,frame: false,transparent:true,      
     webPreferences : 
     {
       nodeIntegration : true
     }});
  

  areaOptsWindow = new BrowserWindow({title:'daxar-areaopts',parent: areaWindow,show:false,minWidth: 10,
     minHeight: 100,width: 45, height: 140, resizable:false,frame: false,      
     webPreferences : 
     {
       nodeIntegration : true
     }});
  
   
 
  areaWindow.loadURL(`file://${__dirname}/views/area.html`)
  
  areaOptsWindow.loadURL(`file://${__dirname}/views/areaopts.html`)
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/views/savedindex.html`)

 
  //Avoiding flash before showing
   mainWindow.once('ready-to-show', () => {
   
      mainWindow.show();
      mainWindow.setContentProtection(true);

     })
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
   
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
   
    mainWindow = null
    app.quit();
  })

 

}
 
app.on('ready', createWindow)

ipc.on('show-area', (e) =>{

  areaWindow.show();
  // cropWindow.show();
  // areaWindow.setContentProtection(true);

  let areaPos = areaWindow.getPosition();
  let areaSize = areaWindow.getSize();
  let x = areaPos[0]+areaSize[0];
  let y = areaPos[1];

  areaOptsWindow.setPosition(x, y);

  areaOptsWindow.show();




  //mainWindow.hide();
  e.sender.send('area-shown');

  areaWindow.on('resize', ()=>{

    let areaPos = areaWindow.getPosition();
    let areaSize = areaWindow.getSize();
    let x = areaPos[0]+areaSize[0];
    let y = areaPos[1];

    //Make options to follow the UIcrop rect
    areaOptsWindow.setPosition(x, y);

  });

  areaWindow.on('move', ()=>{

    let areaPos = areaWindow.getPosition();
    let areaSize = areaWindow.getSize();
    let x = areaPos[0]+areaSize[0];
    let y = areaPos[1];

    areaOptsWindow.setPosition(x, y);


  });



});


 
ipc.on('startstream', function(event){
  
  //Set movable to false(CSS) and ignore events
  areaWindow.webContents.send('streamstarted');
  mainWindow.webContents.send('streamstarted');
  
  areaWindow.setIgnoreMouseEvents(true);


})





ipc.on('stopstream', function(event){
  
  //
  areaWindow.webContents.send('streamstopped'); 
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

    mainWindow.webContents.send('streamstopped', areaWindowConfig);
    areaWindow.hide();
    areaOptsWindow.hide();


})

// ipc.on('vidstream', function(event, stream){

//    cropWindow.webContents.send('vidstream-go', stream);
   
// });
 
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
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
 