import { useState } from 'react';
import { useNavigate } from 'react-router';
import style from '../LoginView.module.css';
function LoginForm() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');
	async function login(formData) {
		const url = import.meta.env.VITE_API + '/session';
		const payload = Object.fromEntries(formData);
		try {
			const response = await fetch(url, {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!response.ok) {
				if (response.status === 400) {
					throw new Error('Invalid Login');
				}
				throw Error(response.status);
			}
			const json = await response.json();
			if (!json.user.admin) {
				throw new Error('That user is not an admin');
			}
			localStorage.setItem('authToken', json.token);
			localStorage.setItem('user', JSON.stringify(json.user));
			navigate('/posts');
		} catch (error) {
			console.error(error);
			setErrorMessage(error.message === 'Failed to fetch' ? 'Could not connect to api' : error.message);
		}
	}
	return (
		<form action={login}>
			{errorMessage && <p className={style.error}>{errorMessage}</p>}
			<label htmlFor="username">Username:</label>
			<input type="text" id="username" name="username" required />
			<label htmlFor="password">Password:</label>
			<input type="password" id="password" name="password" required />
			<button type="submit">Login</button>
		</form>
	);
}

export default LoginForm;
