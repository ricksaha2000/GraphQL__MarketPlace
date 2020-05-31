const {forwardTo} = require('prisma-binding');
const {hasPermission} = require('../utils');

const Query = {
//shorthand for dogs:function(){}
//ctx --> context
//if prisma query matches with Yoga query,then forward to prisma
//no extra logic can be put
//Use the below approach if logic
// async items(parent, args, ctx , info){
//     const items = await  ctx.db.query.items();
//     return items;
// }
//else
items:forwardTo('db'),
item:forwardTo('db'),
itemsConnection:forwardTo('db'),
me(parent, args, ctx , info){
    //check if there's a current userID
    if(!ctx.request.userId){

        return null;
    }

    return ctx.db.query.user({
        where:{id: ctx.request.userId},
    },info);

},
async users(parent, args, ctx , info){
    //check if user is logged in
    if(!ctx.request.userId){
        throw new Error("PLEASE LOG IN BRODA");
    }

    //Check if user has the permissions to query all the users
    hasPermission(ctx.request.user,['ADMIN','PERMISSIONUPDATE']);
    //if they do,query the users ffs
    //pass {} --> emptyware obj to query out all
    return ctx.db.query.users({} ,info);


}
};

module.exports = Query;
