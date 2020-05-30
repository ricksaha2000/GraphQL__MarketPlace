import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import {CURRENT_USER_QUERY} from './User';

const SIGNUP_MUTATION = gql`

    mutation SIGNUP_MUTATION($email:String!,
    $name:String!,
    $password:String!){
        signup(
            email:$email,
            name:$name,
            password:$password,

        ){
            id
            email
            name
        }

    }

`;

class SignUp extends Component {
    state={

       name:"",
       email:"",
       password:"",

    }

    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
      };
    render() {
        return (
            <Mutation
            refetchQueries={[{query:CURRENT_USER_QUERY}]}
            mutation={SIGNUP_MUTATION}
            variables={this.state}>
                {(signup,{error,loading})=>{
        return(
            //method post so that the input variables of the form dont pass in the url and if pwd passes in url , security issue

            <Form method="post" onSubmit = {
                async (e) =>{

                    e.preventDefault();
                    await signup();
                    this.setState({ name: '', email: '', password: '' });


                }
            }>
                <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Signup for an Account</h2>
                    <Error error={error}/>
                    <label htmlFor="email">
                    Email
                    <input type="email"
                    placeholder="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.saveToState}/>
                    </label>
                   <label  htmlFor="name">
                   Name
                   <input type="text"
                    placeholder="name"
                    name="name"
                    value={this.state.name}
                    onChange={this.saveToState} />
                   </label>
                    <label htmlFor="password">
                    Password
                    <input type="password"
                    placeholder="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.saveToState} />
                    </label>


                    <button type="submit">SIGN UP</button>



                </fieldset>


            </Form>
            )


                }}
            </Mutation>

        );
    }
}

export default SignUp;
export {SIGNUP_MUTATION};