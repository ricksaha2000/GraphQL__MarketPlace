import PleaseSignIn from '../components/PleaseSignIn';
import Permissions from '../components/Permission';


const PermissionsPage = props =>(

    <div>
        <PleaseSignIn>
            <Permissions />
        </PleaseSignIn>
    </div>
);

export default PermissionsPage;