import { Link } from 'react-router';
import { useState } from 'react';
import LoginForm from './LoginForm/LoginForm';

function Login() {
	return (
		<>
			<h1>Hello I am login</h1>
			<Link to={'posts'}>Postaway</Link>
			<LoginForm />
		</>
	);
}
export default Login;
