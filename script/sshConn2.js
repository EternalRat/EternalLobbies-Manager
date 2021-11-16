const Client = require("ssh2-sftp-client");

class sshConnexion {    

    _sftp;
    _client;

    /**
     * 
     * @param {Client.ConnectOptions} config 
     */
    constructor(config) {
        this._client = new Client();
        this._sftp = this._client.connect(config);
    };

    async getFiles() {
        let files = new Array();
        await this._sftp.then(() => {
            return this._client.list('./tickets/');
        }).then(datas => {
            datas.forEach(data => {
                if (data.type === '-')
                    files.push({"fileName": data.name});
            });
        }).catch(err => {
            files[0] = {
                "error": err
            };
        });
        return files;
    }

    /**
     * 
     * @param {String} fileName 
     */
    getFileContent(fileName) {
        this._sftp.then(() => {
            this._client.stat
        })
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