require('dotenv').config();
import {app, BrowserWindow, ipcMain } from 'electron';
import {sshConnexion, File} from "./sshConn";
import windowManager from "./windowManager";
import fileManager from "./manager";
const ipc = ipcMain;

ipc.on('createTicketsApp', async() => {
	var files = new Array();
	await sshConnexion.getInstance().getFiles().then(datas => {
		files = datas;
	});
	var htmlContent = {error: false, html: "<div class='menu'><div class='files'>"};
	if (files.length === 0) {
		htmlContent.html = 'Not found.';
	} else {
		files.forEach((file, index) => {
			htmlContent.html += `<div class="file">
				<h3>Ticket ${parseFileName(file.fileName)}</h3>
				<button id="previewBtn" class="filesBtn previewBtn" data-index="${index}" alt="Preview"></button>
				<button id="downloadBtn" class="filesBtn downloadBtn" data-index="${index}" alt="Download"></button>
			</div>`;
		})
		htmlContent.html += '</div></div>';
	}
	windowManager.getWindow("main").webContents.send("ticket", htmlContent);
});

ipc.on('previewHTMLFiles', async(evt, args) => {
	var files = new Array<File>();
	if (windowManager.getWindow("ticket")) {
		windowManager.destroyWindow("ticket");
	}
	windowManager.createWindow("ticket", "web/pages/ticket.html");
	await sshConnexion.getInstance().getFiles().then(datas => {
		files = datas;
	});
	windowManager.getWindow("ticket").webContents.send("previewHTMLFile", await sshConnexion.getInstance().getFileContent(files[args].fileName));
})

ipc.on('createAccountType', async() => {

});

ipc.on("displayAccountsType", async() => {

});

ipc.on('createAccount', async() => {

});

ipc.on('getAccount', async() => {

});

ipc.on('minimizeApp', () => {
	windowManager.getWindow("main").minimize();
});

ipc.on('closeApp', () => {
	windowManager.destroyWindow("main");
});

ipc.on('minimizeTicketApp', () => {
	windowManager.getWindow("ticket").minimize();
});

ipc.on('closeTicketApp', () => {
	windowManager.destroyWindow("ticket");
});

/**
 * 
 * @param {string} fileName 
 */
function parseFileName(fileName: string) {
	return fileName.slice(fileName.lastIndexOf("_") + 1, fileName.lastIndexOf("."));
}

app.whenReady().then(() => {
	windowManager.createWindow("main", "web/index.html");
	fileManager.createFolder();
	sshConnexion.getInstance();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) windowManager.createWindow("main", "web/index.html");
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});