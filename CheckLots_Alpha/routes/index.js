const express = require('express');
const router = express.Router();
const https = require('https');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/transfer', (req, res) => {
	console.log(req.query.secret,req.query.nameId,req.query.value,req.query.curancy);
  res.send("ok");
});



module.exports = router;
