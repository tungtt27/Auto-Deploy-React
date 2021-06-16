const ServerSchema = {
    name: 'server',
    properties: {
        _id: 'string',
        name: 'string',
        host: 'string',
        port: 'int',
        username: 'string',
        password: 'string',
        localFolder: 'string',
        remoteFolder: 'string',
        build: 'string',
        buildScript: {
            type: 'string',
            default: '',
        },
        deployScript: {
            type: 'string',
            default: '',
        },
        deploying: {
            type: 'bool',
            default: false,
        },
    },
    primaryKey: '_id',
};

module.exports = ServerSchema;
