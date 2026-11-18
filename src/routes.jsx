import Login from './components/Login/Login';
import App from './components/App/App';
import UserView from './components/UserView/UserView';
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
async function postsLoader({ request }) {
	requireAuth();
	const token = localStorage.getItem('authToken');
	const requestURL = new URL(request.url);
	const queries = requestURL.search;
	const url = import.meta.env.VITE_API + '/posts/admin' + queries;
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
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
	{
		path: 'users',
		element: <UserView />,
		loader: requireAuth,
	},
];

export default routes;
