const { uploadFile, deploy } = require('../utils')
const express = require('express');
const router = express.Router();
const { connectRealm } = require('../utils');
const uuid = require('uuid');

router.get('/api/server', async (req, res) => {
    const realm = await connectRealm();
    const tasks = realm.objects('server');
    res.send(tasks)
})

router.post('/api/server', async (req, res) => {
    try {
        const realm = await connectRealm();
        const data = req.body;
        data['_id'] = uuid.v4();
        realm.write(() => {
            realm.create('server', data);
        })
        res.send(data)
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message })
    }
});

router.put('/api/server', async (req, res) => {
    try {
        const realm = await connectRealm();
        const data = req.body;
        realm.write(() => {
            realm.create('server', data, 'modified');
        })
        res.send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message })
    }
});

router.delete('/api/server/:pid', async (req, res) => {
    try {
        const realm = await connectRealm();
        const id = req.params.pid;
        realm.write(() => {
            realm.delete(realm.objectForPrimaryKey('server', id));
            res.send({ susses: true })
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message })
    }
});

router.post('/api/deploy', async (req, res) => {
    try {
        const data = req.body;
        await uploadFile(data, (e) => {
            res.status(500).send({ error: e.message })
        });
        res.send({ success: true })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
});

router.post('/api/build', async (req, res) => {
    try {
        const data = req.body;
        await deploy(data.localFolder);
        res.send({ success: true })
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message })
    }
});

module.exports = router;
