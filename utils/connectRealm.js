const ServerSchema = require('../Schema/ServerSchema')
const Realm = require('realm');

module.exports = async () => {
    const realm = await Realm.open({
        path: 'myrealm',
        schema: [ServerSchema],
    });

    return realm;
};
