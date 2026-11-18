import { useState } from 'react';
import './App.css';
import Header from '../../Header/Header';
import Editor from '../Editor/Editor';
import Viewer from '../Viewer/Viewer';
import { useLoaderData } from 'react-router';
import Sidebar from '../Sidebar/Sidebar';
function App() {
	const [currentPost, setCurrentPost] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const posts = useLoaderData();
	return (
		<>
			<Header></Header>
			<Sidebar posts={posts} setCurrentPost={setCurrentPost} setIsEditing={setIsEditing}></Sidebar>

			{!isEditing ? (
				<Viewer currentPost={currentPost} isEditing={setIsEditing}></Viewer>
			) : (
				<Editor currentPost={currentPost} isEditing={setIsEditing}></Editor>
			)}
		</>
	);
}

export default App;
