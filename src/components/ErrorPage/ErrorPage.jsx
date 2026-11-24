import { Link } from 'react-router';
import style from './ErrorPage.module.css';
// A more detailed error page could be good here.
function ErrorPage() {
	return (
		<div className={style.errorDiv}>
			<h1>An error has occured</h1>
			<Link to="/">Back to home</Link>
		</div>
	);
}

export default ErrorPage;
