const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {randomBytes} = require('crypto');
const { promisify } = require('util');
const {transport,makeANiceEmail} = require('../mail');
const Mutations = {
//so this createItem return a promise ,so to store the value in item,
//we need to make the fn a ansynchronous one and await for the query to get executed

    async createItem(parent, args, ctx , info){
        //TODO: Check if logged in
        if(!ctx.request.userId){
             throw new Error("YO YO LOG IN BRUH!");
        }
        //accessing db in context
        const item = await ctx.db.mutation.createItem({
            data:{
                ...args,
                //this is how foreign key ie.User in Item Schema is linked and mutated
                user:{
                    connect:{
                        id:ctx.request.userId,
                    }
                }
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

    async signup(parent, args, ctx , info){
        //lowercase the email
        args.email = args.email.toLowerCase();
        //hash their passwords
        const password = await bcrypt.hash(args.password,10);
        //Create user in DB

        const user = await ctx.db.mutation.createUser({
            data:{
                ...args,
                password:password,
                // as its permissions is an enum field we have to use set
                permissions:{set:['USER']},
                }
        },info);

        //create JWT token for them,so signin not req right after signup
        const token = jwt.sign({userId:user.id},process.env.APP_SECRET)
        // we set jwt as a cookie on the response
        //so as the user clicks on another page, the token comes along with a ride of joyyy
        ctx.response.cookie('token',token,{
            //no 3rd party access
            httpOnly:true,
            maxAge:100*60*60*24*365,//1 yr cookie

        });
        //finally we return the user to the browser..wooho
        return user;

},

    async signin(parent, {email,password}, ctx , info){

            //check if there's an user pertaining to that email
            const user = await ctx.db.query.user(
                {where:{
                    email:email
                }}
            );
            if(!user){
                throw new Error('No such user found');
            }

            //check pwd is correct
            //so check it with the pwd inputted and the pwd for the query just
            //executed which gives an instance of the user pertaining to the particlar user
            const valid = await bcrypt.compare(password,user.password);
            if(!valid){

                throw new Error('Invalid Password');

            }

            //generate jwt token
            const token = jwt.sign({userId:user.id},process.env.APP_SECRET);
            //set cookie with the token
            ctx.response.cookie('token',token,{
                //no 3rd party access
                httpOnly:true,
                maxAge:100*60*60*24*365,//1 yr cookie

            });
            //return the user
            return user;


    },


    signout(parent, args, ctx , info){

            ctx.response.clearCookie('token');
            return {message:'Signing Off!!'};

    },




async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    console.log(res);
    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: 'jayitsaha@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env
        .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });

    // 4. Return the message
    return { message: 'Thanks!' };
  },

    async resetPassword(parent, args, ctx, info){

        //check if passwords match
        if(args.password !== args.confirmPassword)
        {
            throw new Error("Passwords Don't Match");
        }
        //check if its a legit reset token
        //check if its expired
        const [user] = await ctx.db.query.users({
            where:{
                resetToken:args.resetToken,
                resetTokenExpiry_gte:Date.now() - 3600000,
            },

        });
        if(!user){
            throw new Error('This token is Invalid or Expired!!');
        }

        //hash their new pwd
        const password = await bcrypt.hash(args.password,10);

        //Save the new password to the user and remove old resetToken fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where:{
                email:user.email
            },
            data:{
                password:password,
                resetToken:null,
                resetTokenExpiry:null,

            },
        });
        //generate JWT

        const token = jwt.sign({userId:updatedUser.id},process.env.APP_SECRET)

        //finally we return the user to the browser..wooho
        //set the jwt cookie
        // we set jwt as a cookie on the response
        //so as the user clicks on another page, the token comes along with a ride of joyyy
        ctx.response.cookie('token',token,{
            //no 3rd party access
            httpOnly:true,
            maxAge:100*60*60*24*365,//1 yr cookie

        });
        //return the new user
        return updatedUser;

        //DONEZOOO

    }


};

module.exports = Mutations;
