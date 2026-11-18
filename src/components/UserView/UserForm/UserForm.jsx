function UserForm({ currentUser }) {
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
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
		}
	}
	return (
		<div>
			<form action="">
				<legend>Edit Current user:</legend>
				<label htmlFor="username">Username:</label>
				<input type="text" name="username" id="username" defaultValue={currentUser.username} />
				<label htmlFor="password">Password:</label>
				<input type="text" name="password" id="password" />
				<label htmlFor="admin">Admin:</label>
				<input type="checkbox" name="admin" id="admin" defaultChecked={currentUser.admin ? true : false} />
				<button type="submit">Submit</button>
			</form>
			{/* I could have a popup like I have done before, but I am getting tired of making those */}
			{currentUser.id && (
				<button type="button" onClick={deleteUser}>
					Delete {currentUser.username}?
				</button>
			)}
		</div>
	);
}

export default UserForm;
