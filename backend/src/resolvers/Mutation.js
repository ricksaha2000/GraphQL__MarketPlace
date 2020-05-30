const Mutations = {
//so this createItem return a promise ,so to store the value in item,
//we need to make the fn a ansynchronous one and await for the query to get executed

    async createItem(parent, args, ctx , info){
        //TODO: Check if logged in
        //accessing db in context
        const item = await ctx.db.mutation.createItem({
            data:{
                ...args
            }
        },info);

        return item;

    },


    async updateItem(parent, args, ctx , info){
        //first take a copy of the updates
        const updates = {...args};
        //remove id from updates as that we shouldnt allow user to update
        delete updates.id;
        //run the updateMethod
        return ctx.db.mutation.updateItem({
            data:updates
            ,
            where:{
                id:args.id
            }
        },info);


    },

    async deleteItem(parent, args, ctx , info){

        const where = {id:args.id};
        //find the item
        //generally we pass info , which gets displayed in the frotend after
        //the query or mutation is performed, but as this is an
        //intermediary, hence we customize the info
        const item = await ctx.db.query.item({where},`{id title}`);

        //Check if the user owns the item
        //Delete It
        //Finally deleting the specified item after checking perms and returning the desired info

        return ctx.db.mutation.deleteItem({where},info);
    },


    

};

module.exports = Mut