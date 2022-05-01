const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

router.get('/1', (req, res) => {
    return res.send('Hello World 1');
});

module.exports = router;

