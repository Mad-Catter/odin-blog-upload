import { useRef } from 'react';
import DeleteButton from '../../DeleteButton/DeleteButton';
import style from '../Userview.module.css';
function UserForm({ currentUser, setCurrentUser, statusMessage, setStatusMessage }) {
	const adminRef = useRef(null);
	async function deleteUser() {
		// Patch is for updating posts, if there is no current post we want to post a new post instead
		const url = import.meta.env.VITE_API + `/users/${currentUser.id}`;
		const token = localStorage.getItem('authToken');
		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: { Authorization: 'Bearer ' + token },
			});
			if (!response.ok) {
				// Error bodies aren't always JSON (proxies, 502s, etc.), so fall back safely
				const body = await response.json().catch(() => null);
				const message = body?.message || body?.error || response.statusText;
				const err = new Error(message);
				err.status = response.status;
				err.details = body; // keep the full body in case you need field-level errors
				throw err;
			}
			const text = await response.text();
			const json = text ? JSON.parse(text) : null;
			console.log('Deleted:', json ?? response.status);
			setStatusMessage(`Successfully deleted user: ` + currentUser.username);
			setCurrentUser({});
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
			setStatusMessage(error.status + ': Failed to delete user.');
		}
	}
	async function updateUser(formData) {
		const url = import.meta.env.VITE_API + '/users/' + currentUser.id;
		const token = localStorage.getItem('authToken');
		formData.set('admin', adminRef.current.checked);
		const payload = Object.fromEntries(formData);
		try {
			const response = await fetch(url, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
				body: JSON.stringify(payload),
			});
			if (!response.ok) {
				const body = await response.json().catch(() => null);
				const message = body?.message || body?.error || response.statusText;
				const err = new Error(message);
				err.status = response.status;
				err.details = body;
				throw err;
			}
			setStatusMessage('Updated user successfully.');
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
			console.error(error.details);
			setStatusMessage(error.status + ': Could not update user.');
		}
	}
	return (
		<div>
			<form action={updateUser}>
				<legend>Edit Current user:</legend>
				<div className={style.userFlex}>
					<div className={style.inputFlex}>
						<label htmlFor="username">Username:</label>
						<input type="text" name="username" id="username" defaultValue={currentUser.username} />
					</div>
					<div className={style.inputFlex}>
						<label htmlFor="password">Password:</label>
						<input type="text" name="password" id="password" />
					</div>
					<div className={`${style.inputFlex} ${style.checkboxFlex}`}>
						<label htmlFor="admin">Admin:</label>
						<input
							type="checkbox"
							name="admin"
							id="admin"
							defaultChecked={currentUser.admin ? true : false}
							ref={adminRef}
						/>
					</div>
				</div>
				<div className={style.buttonDiv}>
					<DeleteButton
						fn={deleteUser}
						text={'Delete ' + (currentUser.username ? currentUser.username : 'user')}
						disabled={!currentUser.id ? true : false}
					/>

					<button type="submit" disabled={!currentUser.id ? true : false}>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}

export default UserForm;
