import { useNavigate } from 'react-router';

function Header() {
	const navigate = useNavigate();
	function logout() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		navigate('/');
	}
	return (
		<header>
			<button onClick={logout}>Logout</button>
		</header>
	);
}

export default Header;
