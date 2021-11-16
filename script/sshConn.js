const { Client, ConnectConfig } = require("ssh2");

class sshConnexion {

	//_sftp;
	_client;

	/**
	 * 
	 * @param {ConnectConfig} config 
	 */
	constructor(config) {
		this._client = new Client();
		this._client.connect(config);
	};

	getFiles() {
		let files = new Array();
		this._client.sftp((err, sftp) => {
			if (err) throw err;
			sftp.readdir('./tickets/', (err, list) => {
				if (err) throw err;
				list.forEach(file => {
					files.push({ fileName: file.filename });
				})
			});
		});
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(files), 200);
		});
	}

	/**
	 * 
	 * @param {String} fileName 
	 */
	getFileContent(fileName) {
		var m_fileBuffer;
		this._client.sftp((err, sftp) => {
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
			setTimeout(() => {
				resolve(m_fileBuffer.toString('utf8'));
			}, 200);
		});
	}

	downloadFile() {

	}
};

module.exports = class sshSingleton {

	constructor() {
		if (!sshSingleton.instance) {
			sshSingleton.instance = new sshConnexion({
				host: process.env.HOSTNAME,
				port: 22,
				username: process.env.USER,
				password: process.env.PASSWORD
			});
		}
	}

	/**
	 * @returns {sshConnexion}
	 */
	getInstance() {
		return sshSingleton.instance;
	}
}