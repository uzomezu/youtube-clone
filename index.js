const express = require('express');
const cors = require('cors');
const path = require('path');
const next  = require('next');
const db = require('./backend/models/');
const config = require('./backend/config');

const dev = config.NODE_ENV == 'dev';

const client = next({ dev });
const handle = client.getRequestHandler();

client.prepare().then(()=>{
    const server = express();
    server.use(cors());
    server.use(express.json());
    server.all("*", (req,res)=>{
        return handle(req,res);
    })
    const port = config.PORT || '';


    db.sequelize.sync({force: dev }).then(()=>{
        if(dev) {
            console.log("Dropping and Re-Syncing the DB...")
        }

        server.listen(port, ()=>{
            console.log("Server Listening on PORT: ", port)
        })
    })
}).catch((ex)=>{
    console.log(ex.stack);
    process.exit(1);
})

