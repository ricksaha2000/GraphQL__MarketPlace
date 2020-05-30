import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut';

const Nav = () =>{

    return(

        // <User>
        //         {/* we have payload we destructure the data then destructure the data to me */}
        //         {({data:{ me }} ) =>{
        //             console.log(me);
        //         if(me) return <p>{me.name}</p>
        //         return null;
        //         }}
        //     </User>
        <User>
    {({ data }) => {
      const me = data ? data.me : null
      return (
      <NavStyles data-test="nav">
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <SignOut />

          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>

        )}
      </NavStyles>
    )
    }}
  </User>

    )
}
export default Nav;