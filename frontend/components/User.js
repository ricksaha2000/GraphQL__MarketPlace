import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`

    query {
me{
        id
        email
        name
        permissions

}


    }

`;

const User = props=>(
//so what we are doing is to make a QUERY fn
//which is reusable, pass down the query payload into the chidren so that
//they can be used there
    <Query
    //additional props will get passed from other components
    {...props}
    query={CURRENT_USER_QUERY}>

        {(payload)=>props.children(payload)}

    </Query>
);


User.PropTypes = {
    children:PropTypes.func.isRequired,
}

export default User;
export {CURRENT_USER_QUERY};