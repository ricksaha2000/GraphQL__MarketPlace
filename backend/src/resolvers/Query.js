const {forwardTo} = require('prisma-binding');

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

};

module.exports = Query;
