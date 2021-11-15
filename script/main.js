const {app, BrowserWindow, ipcMain } = require('electron');
const sshSingleton = require("./sshConn");
const path = require('path');
const ipc = ipcMain;
require('dotenv').config();

function createWindow () {
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 680,
		minWidth: 940,
		minHeight: 560,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true,
			preload: path.join(__dirname, 'preload.js')
		}
	});
	const ssh = new sshSingleton();

	mainWindow.loadFile('web/index.html');

	ipc.on('minimizeApp', () => {
		mainWindow.minimize();
	});

	ipc.on('minMaxApp', () => {
		if (mainWindow.isMaximized()) {
			mainWindow.restore();
		} else {
			mainWindow.maximize();
		}
	});

	ipc.on('createTicketsApp', async() => {
		var files;
    await ssh.getInstance().getFiles().then(datas => {
      files = datas;
    });
    console.log(files);
	});

	ipc.on('closeApp', () => {
		mainWindow.close();
	});

	mainWindow.on('maximize', () => {
		mainWindow.webContents.send("isMaximized");
	});

	mainWindow.on('unmaximize', () => {
		mainWindow.webContents.send("isRestored");
	});
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})