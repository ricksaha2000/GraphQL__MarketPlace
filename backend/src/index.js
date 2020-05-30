// let's go!
//KICKSTART THE NODE SERVER HERE
//Configuring the .env file as this is the node application/backend entry point

require('dotenv').config({path:'variables.env'});
//import the YOGA SERVER STARTING -- Calls the function
const createServer = require('./createServer');
//import the Prisma Connecion to Start Off
const db = require('./db')

const server = createServer();

//TODO Use Express MiddleWare to handle cookies(JWT)
////TODO Use Express MiddleWare to populate  current user


//Start the server
server.start({
    cors:{
        credentials:true,
        origin:process.env.FRONTEND_URL,
    },
},deets =>{
console.log(`SERVER IS NOW RUNNING on port http://localhost:${deets.port}`);

}
);




