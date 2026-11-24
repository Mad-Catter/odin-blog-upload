import { useState } from 'react';
import RetrieveUser from './RetrieveUser/RetrieveUser';
import UserForm from './UserForm/UserForm';
import Header from '../Header/Header';
import style from './Userview.module.css';

function UserView() {
	const [currentUser, setCurrentUser] = useState({});
	const [statusMessage, setStatusMessage] = useState('');
	return (
		<>
			<Header></Header>
			<div className={style.userView}>
				{statusMessage && <p className={style.statusMessage}>{statusMessage}</p>}
				<RetrieveUser
					setCurrentUser={setCurrentUser}
					statusMessage={statusMessage}
					setStatusMessage={setStatusMessage}
				></RetrieveUser>
				<UserForm
					currentUser={currentUser}
					setCurrentUser={setCurrentUser}
					key={'userid' + currentUser.id || 0}
					statusMessage={statusMessage}
					setStatusMessage={setStatusMessage}
				></UserForm>
			</div>
		</>
	);
}
export default UserView;
