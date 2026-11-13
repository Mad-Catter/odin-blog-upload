import { useState } from 'react';
import './App.css';
import Header from './Header/Header';
import { useLoaderData } from 'react-router';
import Sidebar from './Sidebar/Sidebar';
function App() {
	const [currentPost, setCurrentPost] = useState(null);
	const posts = useLoaderData();
	return (
		<>
			<Header></Header>
			<h1>Hello</h1>
			<Sidebar posts={posts} setCurrentPost={setCurrentPost}></Sidebar>
			<h1>I am the current post id: {currentPost}</h1>
		</>
	);
}

export default App;
