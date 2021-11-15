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

    getFiles() {
        this._sftp.then(() => {
            return this._client.list('./');
        }).then(data => {
            
        }).catch(err => {
            
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