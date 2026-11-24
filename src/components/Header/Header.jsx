import { Link, useNavigate } from 'react-router';
import style from './Header.module.css';
function Header() {
	const navigate = useNavigate();
	function logout() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		navigate('/');
	}
	return (
		<header className={style.mainHeader}>
			<nav>
				<Link to="../posts">Posts</Link>
				<Link to="../users">Users</Link>
				<a href="">
					<button onClick={logout}>Logout</button>
				</a>
			</nav>
		</header>
	);
}

export default Header;
