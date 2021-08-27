const express = require('express');
const app = express();
const { fileBased } = require('../dist');

    app.use( express.json() )
    app.use( fileBased() ) // routes is default directory
    app.use('/api', fileBased({directory: '/api' }))

    app.listen(3000);