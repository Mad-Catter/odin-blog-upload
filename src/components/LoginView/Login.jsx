import { useState } from 'react';
import LoginForm from './LoginForm/LoginForm';
import style from './LoginView.module.css';
function Login() {
	return (
		<div className={style.loginBody}>
			<h1>Please login with an admin account</h1>
			<LoginForm />
		</div>
	);
}
export default Login;
