// let's go!
//KICKSTART THE NODE SERVER HERE
//Configuring the .env file as this is the node application/backend entry point
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({path:'variables.env'});
//import the YOGA SERVER STARTING -- Calls the function
const createServer = require('./createServer');
//import the Prisma Connecion to Start Off
const db = require('./db')

const server = createServer();
//we dont use LocalStorage because there is no concept of auro refresh Token in LS ie. doesnt have prev knowledge that whether user is logged in or not,
//so first only the logged out parts are rendered , then it gets to know user logged in
//then after a x sec glitch it switches to the logged in mode
//thus use cookies instead
//TODO Use Express MiddleWare to handle cookies(JWT)
//a middleware is a fn that'll run in th middle of a request and response handling stuffs
//this server.express.use(); uses any available express middleware
//here specifically the cookieParser
server.express.use(cookieParser());
////TODO Use Express MiddleWare to populate  current user
//decode the JWT so we can get the userId on each request

server.express.use((req,res,next) =>{

        const {token} = req.cookies;

        if(token){
            const {userId} = jwt.verify(token, process.env.APP_SECRET);

        //put the userId onto the req for future requests to access

            req.userId = userId;


        }


        next();

});
//create a middleware that populates the user on each request

server.express.use(async (req,res,next) =>{

    //if user not logged in,skip



    if(!req.userId) return next();

    const user = await db.query.user({
        where:{
            id:req.userId
              }
    },'{id,permissions,email,name}');
    //thus we are putting the logged in user to the cookie user and thus
    //application will know this on every load
    req.user = user;
    next();

});

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




