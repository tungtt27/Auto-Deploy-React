const ServerSchema = require('../Schema/ServerSchema')
const {uploadFile,deploy} = require('../autodeploy')
const {v4: uuidv4} = require('uuid');
const express = require('express');
const router = express.Router();
const Realm = require('realm');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/server', async (req, res) => {
    const realm = await Realm.open({
        path: "myrealm",
        schema: [ServerSchema],
    });
    const tasks = realm.objects("server");
    res.send(tasks)
})
router.post('/server', async (req, res) => {
    try {
        const realm = await Realm.open({
            path: "myrealm",
            schema: [ServerSchema],
        });
        const data = req.body;
        data['_id'] = uuidv4();
        console.log(req.body);
        realm.write(() => {
            realm.create("server", data);
        })
        res.send(data)
    } catch (e) {
        console.log(e);
        res.status(404).send({error: e.message})
    }

})
router.put('/server', async (req, res) => {
    try {
        const realm = await Realm.open({
            path: "myrealm",
            schema: [ServerSchema],
        });
        const data = req.body;
        realm.write(() => {
            realm.create("server", data, "modified");
        })
        res.send(data)
    } catch (e) {
        console.log(e);
        res.status(404).send({error: e.message})
    }
})
// router.push('server', () => {
//
// })
router.delete('/server/:pid', async (req, res) => {
    try {
        const realm = await Realm.open({
            path: "myrealm",
            schema: [ServerSchema],
        });
        const id = req.params.pid;
        realm.write(() => {
            realm.delete(realm.objectForPrimaryKey("server", id));
            res.send({susses: true})
        })
    } catch (e) {
        console.log(e);
        res.status(404).send({error: e.message})
    }
})
router.post('/deploy', async (req, res) => {
    try {
        const data = req.body;
        const result = await uploadFile(data,(e)=>{
            res.status(404).send({error: e.message})
        });
        res.send({success: true})
    } catch (e) {
        res.status(404).send({error: e.message})
    }
})
router.post('/build', async (req, res) => {
    try {
        const data = req.body;
        const result = await deploy(data.localFolder);
        res.send({success: true})
    } catch (e) {
        console.log(e);
        res.status(404).send({error: e.message})
    }
})
module.exports = router;
