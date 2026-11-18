import { Link, useNavigate } from 'react-router';

function Header() {
	const navigate = useNavigate();
	function logout() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		navigate('/');
	}
	return (
		<header>
			<Link to="../posts">Posts</Link>
			<Link to="../users">Users</Link>
			<button onClick={logout}>Logout</button>
		</header>
	);
}

export default Header;
