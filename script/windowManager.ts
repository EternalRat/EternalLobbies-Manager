import { BrowserWindow } from "electron";
const path = require('path');

export default class WindowManager {
	private static _windows = new Map<String, BrowserWindow>();

	/**
	 * 
	 * @param {String} windowName 
	 * @param {String} pathFile 
	 */
	public static createWindow(windowName: string, pathFile: string) {
		const windows = new BrowserWindow({
			width: 754,
			height: 560,
			minWidth: 754,
			minHeight: 560,
			maxWidth: 754,
			maxHeight: 560,
			darkTheme: true,
			frame: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				devTools: true,
				preload: path.join(__dirname, 'preload.js')
			}
		});

		windows.loadFile(pathFile);
		this._windows.set(windowName, windows);
	}

	/**
	 * 
	 * @param {String} windowName 
	 * @returns {BrowserWindow}
	 */
	public static getWindow(windowName: string): BrowserWindow | any {
		return this._windows.get(windowName);
	}

	/**
	 * 
	 * @param {String} windowName 
	 */
	public static destroyWindow(windowName: string): BrowserWindow | any {
		var window : BrowserWindow = this.getWindow(windowName);
		if(!window)
			return;
		window.close();
		this._windows.delete(windowName);
	}
}