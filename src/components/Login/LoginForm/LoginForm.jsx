import { useNavigate } from 'react-router';

function LoginForm() {
	const navigate = useNavigate();
	async function login(formData) {
		const url = import.meta.env.VITE_API + '/session';
		const payload = Object.fromEntries(formData);
		try {
			const response = await fetch(url, {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!response.ok) throw Error(response.status);
			const json = await response.json();
			if (!json.user.admin) {
				throw new Error('User is not an admin');
			}
			localStorage.setItem('authToken', json.token);
			localStorage.setItem('user', JSON.stringify(json.user));
			navigate('/posts');
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<form action={login}>
			<label htmlFor="username">Username:</label>
			<input type="text" id="username" name="username" required />
			<label htmlFor="password">Password:</label>
			<input type="password" id="password" name="password" required />
			<button type="submit">Login</button>
		</form>
	);
}

export default LoginForm;
