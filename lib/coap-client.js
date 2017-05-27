'use strict';

const exec = require('child_process').exec;
const CoapCommandBuilder = require('./command-builder');

class CoapClient {
    constructor(config) {
        this.commandBuilder = new CoapCommandBuilder(config.coapClientPath, config.securityId, config.hubIpAddress);
    }

    getDevices(deviceId) {
        const command = this.commandBuilder.get('device', deviceId);
        return this.constructor.makeRequest(command);
    }

    getGroups(groupId) {
        const command = this.commandBuilder.get('group', groupId);
        return this.constructor.makeRequest(command);
    }

    operate(type, id, operation) {
        const command = this.commandBuilder.put(type, id, operation);
        return this.constructor.makeRequest(command, false);
    }

    static makeRequest(command, parseResponse) {
        if (parseResponse == undefined) parseResponse = true;
        return new Promise((resolve, reject) => {
            exec(command, {
                timeout: 5000
            }, (err, stdOut) => {
                if (parseResponse) {
                    if (stdOut) {
                        try {
                            resolve(JSON.parse(stdOut.split('\n')[3]));
                        } catch (err) {
                            reject('Invalid response!');
                        }
                    } else {
                        reject('Failed to connect!');
                    }
                } else {
                    resolve({});
                }
            });
        });
    }

    static create(config) {
        return new CoapClient(config);
    }
}

module.exports = CoapClient;
