import Login from './components/LoginView/Login';
import App from './components/PostsView/App/App';
import UserView from './components/UserView/UserView';
import ErrorPage from './components/ErrorPage/ErrorPage';
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
	const queries = requestURL.search ? '&' + requestURL.search.slice(1) : '';
	// I have this currently taking all posts available which should probably be fine for this project but it could cause issues for a bigger one.
	const url = import.meta.env.VITE_API + '/posts/admin?take=max' + queries;
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
		errorElement: <ErrorPage />,
	},
	{
		path: 'posts',
		element: <App />,
		loader: postsLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: 'users',
		element: <UserView />,
		loader: requireAuth,
		errorElement: <ErrorPage />,
	},
];

export default routes;
