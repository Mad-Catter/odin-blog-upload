import Login from './components/Login/Login';
import App from './components/App/App';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'react-router';

function legalToken() {
	const token = localStorage.getItem('authToken');
	if (!token || token === 'undefined') {
		return false;
	}
	const decoded = jwtDecode(token);
	return decoded.exp * 1000 < Date.now() ? false : true;
}
function loginLoader() {
	if (legalToken()) {
		throw redirect('/posts');
	}
}
function requireAuth() {
	if (!legalToken()) {
		throw redirect('/');
	}
}
async function postsLoader() {
	requireAuth();
	// This should very likely be changed to either changing the posts view or changing the local storage to store both the usre and the token
	let user = localStorage.getItem('user');
	const token = localStorage.getItem('authToken');
	user = JSON.parse(user);
	const url = import.meta.env.VITE_API + '/posts/user/' + user.id;
	console.log(url);
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			console.log('elllll');
			throw new Error(response.status);
		}
		return await response.json();
	} catch (error) {
		console.error(error);
	}
}

const routes = [
	{
		path: '/',
		element: <Login />,
		loader: loginLoader,
	},
	{
		path: 'posts',
		element: <App />,
		loader: postsLoader,
	},
];

export default routes;
