const express = require('express');
const app = express();

const categoryRoutes = require('./api/routes/categories');

// app.use('/', (req, res, next) => {
//     res.status(200).json({
//         "message": "Please use a API endpoint, see documentation"
//         });
//     });

app.use('/categories', categoryRoutes);

module.exports = app;