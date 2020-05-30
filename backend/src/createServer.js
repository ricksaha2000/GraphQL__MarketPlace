//HERE WE IMPORT GRAPHQL YOGA -- ITS AN EXPRESS MIDDLEWARE
//BUILT ON APOLLO SERVER

const { GraphQLServer } = require('graphql-yoga');

//Two types of resolvers QueryResolvers --pull data
//MutationResolvers --push data
//They answer the qn that where this data comes from or
//what can we do with the fetched data

 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const db = require('./db');


 //Create the GraphQl Yoga Server


 function createServer(){

        return new GraphQLServer({
            typeDefs:'src/schema.graphql',
            //For the mutations and query
            resolvers:{
                Mutation,
                Query
            },
            //TO bypass unwanted errors,need to READ DOCS
            resolverValidationOptions:{
                requireResolversForResolveType:false,

            },
            //With every req, we need to traverse the db
            //OR HIT THE DB
            //{...req} ... -> spread operator , distributes the req in an immutable way

            context: req => ({...req , db}),

        });

 }

 module.exports = createServer;