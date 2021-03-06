import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import {CURRENT_USER_QUERY} from './User';
import {UPDATE_PERMISSIONS_MUTATION} from './Permission';

const SIGNIN_MUTATION = gql`

    mutation SIGNIN_MUTATION($email:String!,
    $password:String!){
        signin(
            email:$email,
            password:$password,

        ){
            id
            email
            name
        }

    }

`;

class SignIn extends Component {
    state={


       email:"",
       password:"",

    }

    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
      };
    render() {
        return (
            <Mutation
            refetchQueries={[{query:CURRENT_USER_QUERY,UPDATE_PERMISSIONS_MUTATION}]}
            mutation={SIGNIN_MUTATION}
            variables={this.state}>
                {(signin,{error,loading})=>{
        return(
            //method post so that the input variables of the form dont pass in the url and if pwd passes in url , security issue

            <Form method="post" onSubmit = {
                async (e) =>{

                    e.preventDefault();
                    await signin();
                    this.setState({email:'', password:''});


                }
            }>
                <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Signin to your Account</h2>
                    <Error error={error}/>
                    <label htmlFor="email">
                    Email
                    <input type="email"
                    placeholder="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.saveToState}/>
                    </label>

                    <label htmlFor="password">
                    Password
                    <input type="password"
                    placeholder="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.saveToState} />
                    </label>


                    <button type="submit">SIGN IN</button>



                </fieldset>


            </Form>
            )


                }}
            </Mutation>

        );
    }
}

export default SignIn;
export {SIGNIN_MUTATION}