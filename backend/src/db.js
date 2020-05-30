//This file connects to the remote Prisma DB and gives us
//the ability to query graphql with js
//The client ie. apollo queries from the client and then sends
//to YOGA , where further additional logic is implemented
//and then sent to PRISMA for actual mutuations and creation of endpoints


const {Prisma} = require('prisma-binding');
const db = new Prisma({

    typeDefs:'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret:process.env.PRISMA_SECRET,
    debug:false,



});

module.exports = db;