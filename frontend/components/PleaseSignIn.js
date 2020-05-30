import {Query} from 'react-apollo';
import {CURRENT_USER_QUERY} from './User';
import SignIn from './SignIn';

const PleaseSignIn = (props) =>
        <Query
        query={CURRENT_USER_QUERY}>

            {({data,loading}) =>{
                if(loading) return <p>Loading...</p>;
                //remember the me query??which checked the web token ??we checking for that btw...ting tong...
                if(!data.me) return(
                <div>
                    <p>Please Sign In BRUHH!!</p>
                    <SignIn />
                </div>);
            //no conditions satisfied,return whatever ur childs meant to mommy
            return props.children;
            }}

        </Query>


export default PleaseSignIn;