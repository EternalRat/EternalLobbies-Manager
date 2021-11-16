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
		var files = new Array();
		await ssh.getInstance().getFiles().then(datas => {
			files = datas;
		});
		var htmlContent = "<div class='menu'><div class='files'>";
		files.forEach((file, index) => {
			htmlContent += `<div class="file"><h3>Ticket ${parseFileName(file.fileName)}</h3><button id="previewBtn" class="filesBtn previewBtn" data-index="${index}" alt="Preview"></button><button id="downloadBtn" class="filesBtn downloadBtn" data-index="${index}" alt="Download"></button></div>`;
		})
		htmlContent += '</div><div class="preview"></div></div>';
		mainWindow.webContents.send("ticket", htmlContent);
	});

	ipc.on('previewHTMLFiles', async(evt, args) => {
		var files = new Array();
		//files = ssh.getInstance().getFiles();
		await ssh.getInstance().getFiles().then(datas => {
			files = datas;
		});
		mainWindow.webContents.send("previewHTMLFile", await ssh.getInstance().getFileContent(files[args].fileName));
	})

	ipc.on("displayAccounts", async() => {

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

/**
 * 
 * @param {String} fileName 
 */
function parseFileName(fileName) {
	return fileName.slice(fileName.lastIndexOf("_") + 1, fileName.lastIndexOf("."));
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