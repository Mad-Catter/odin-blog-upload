import { useState } from 'react';
import style from '../Userview.module.css';
function RetrieveUser({ setCurrentUser, statusMessage, setStatusMessage }) {
	const [getUsername, setGetUsername] = useState('');
	const [getId, setGetId] = useState('');

	async function getUser(type) {
		// Patch is for updating posts, if there is no current post we want to post a new post instead
		const url = import.meta.env.VITE_API + `/users/${type === 'username' ? getUsername : getId}/${type}`;
		const token = localStorage.getItem('authToken');
		try {
			const response = await fetch(url, {
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
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
			const json = await response.json();
			console.log(json);
			setCurrentUser(json);
			if (statusMessage) setStatusMessage('');
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
			if (error.status === 404) {
				setCurrentUser({});
				setStatusMessage('Could not retrieve user.');
			}
		}
	}
	return (
		<div className={style.retrieveForms}>
			<form action={() => getUser('username')}>
				<label htmlFor="getByUsername">Get by username:</label>
				<input
					type="text"
					id="getByUsername"
					name="username"
					value={getUsername}
					onChange={(e) => setGetUsername(e.target.value)}
				/>
				<button type="submit">Search</button>
			</form>

			<form action={() => getUser('id')}>
				<label htmlFor="getById">Get by userId:</label>
				<input type="number" id="getById" name="id" value={getId} onChange={(e) => setGetId(e.target.value)} />
				<button type="submit">Search</button>
			</form>
		</div>
	);
}

export default RetrieveUser;
