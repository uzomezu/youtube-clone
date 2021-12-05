const express = require('express');
const cors = require('cors');
const path = require('path');
const next  = require('next');
const db = require('./backend/models/');
const config = require('./backend/config');

// ... Routes
const userRoutes = require('./backend/routes/users.routes');

const dev = config.NODE_ENV == 'dev';

const client = next({ dev });
const handle = client.getRequestHandler();

client.prepare().then(()=>{
    const server = express();
    // server.use(cors());
    server.use(express.json());
    
    // ... routes
    server.use('/api/users', userRoutes);
    

    server.all("*", (req,res)=>{
        return handle(req,res);
    })
    const port = config.PORT || '';


    db.sequelize.sync({force: dev }).then(async ()=>{
        if(dev) {
            console.log("Dropping and Re-Syncing the DB ...")
        }
        // ... initialize roles
        // db.initRoles();
        server.listen(port, ()=>{
            console.log("Server Listening on PORT: ", port)
        })
    })
}).catch((ex)=>{
    console.log(ex.stack);
    process.exit(1);
})

