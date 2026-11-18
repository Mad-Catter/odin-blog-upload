import { useState } from 'react';
import RetrieveUser from './RetrieveUser/RetrieveUser';
import UserForm from './UserForm/UserForm';
import Header from '../Header/Header';

function UserView() {
	const [currentUser, setCurrentUser] = useState({});

	return (
		<div className="userView">
			<Header></Header>
			<RetrieveUser setCurrentUser={setCurrentUser}></RetrieveUser>
			<UserForm currentUser={currentUser} key={'userid' + currentUser.id || 0}></UserForm>
		</div>
	);
}
export default UserView;
