const Client = require("ssh2").Client;

class sshConnexion {    

    _ssh = new Client();

    constructor() {};

    /**
     * 
     * @param {String} hostname 
     * @param {Number} port 
     * @param {String} username 
     * @param {String} password 
     */
    initConnexion(hostname, port, username, password) {
        this._ssh.connect(
            {
                host: hostname,
                port: port,
                username: username,
                password: password
            }
        );
    }


};

module.exports = class sshSingleton {

    constructor() {
        if (!sshSingleton.instance) {
            sshSingleton.instance = new sshConnexion();
        }
    }
  
    /**
     * @returns {sshConnexion}
     */
    getInstance() {
        return sshSingleton.instance;
    }
}