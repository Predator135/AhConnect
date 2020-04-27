const express = require('express');
const router = express.Router();

const categories = require('./scrapeCategories');

router.get('/', (req, res, next) => {
    categories.then((data) => {
        res.status(200).json({data});
    });
});

module.exports = router;