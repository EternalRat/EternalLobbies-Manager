import mongoose from "mongoose";
import { Client, ConnectConfig } from "ssh2";

export interface File {
	fileName: string
};

export class sshConnexion {
	private static instance: sshConnexion;
	private static _client : Client;

	/**
	 * 
	 * @param {ConnectConfig} config 
	 */
	private constructor(config: ConnectConfig) {
		sshConnexion._client = new Client();
		sshConnexion._client.connect(config);
	};

	public static getInstance(): sshConnexion {
		if (!sshConnexion.instance) {
			sshConnexion.instance = new sshConnexion({
				host: process.env.HOSTNAME,
				port: 22,
				username: process.env.USER,
				password: process.env.PASSWORD
			});
		}
		return sshConnexion.instance;
	}

	public getFiles() : Promise<Array<File>> {
		let files = new Array<File>();
		sshConnexion._client.sftp((err, sftp) => {
			if (err) throw err;
			sftp.readdir('./tickets/', (err, list) => {
				if (err) throw err;
				list.forEach(file => {
					files.push({ fileName: file.filename });
				})
			});
		});
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(files), 300);
		});
	}

	/**
	 * 
	 * @param {string} fileName 
	 */
	getFileContent(fileName: string) : Promise<String> {
		var m_fileBuffer : Buffer;
		sshConnexion._client.sftp((err, sftp) => {
			if (err) throw err;
			var dataLength = 0;
			var data = new Array();
			var stream = sftp.createReadStream("./tickets/" + fileName);
			stream.on('data', (d) => {
				data.push(d);
				dataLength += d.length;
			})
			.on('error', (e) => {
				throw e;
			})
			.on('close', () => {
				m_fileBuffer = Buffer.concat(data, dataLength);
				sftp.end();
			});
		});
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(m_fileBuffer.toString('utf8')), 300);
		});
	}

	/**
	 * 
	 * @param {string} fileName 
	 */
	downloadFile(fileName: string): any {
		sshConnexion._client.sftp((err, sftp) => {
			if (err) throw err;
			var m_fileBuffer : Buffer;
			var dataLength = 0;
			var data = new Array();
			var stream = sftp.createReadStream("./tickets/" + fileName);
			stream.on('data', (d) => {
				data.push(d);
				dataLength += d.length;
			})
			.on('error', (e) => {
				throw e;
			})
			.on('close', () => {
				m_fileBuffer = Buffer.concat(data, dataLength);
				sftp.end();
			});
		});
	}
};