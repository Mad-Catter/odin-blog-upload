import { useState } from 'react';
import style from './App.module.css';
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
			<main>
				<div className={style.Sidebar}>
					<Sidebar posts={posts} setCurrentPost={setCurrentPost} setIsEditing={setIsEditing}></Sidebar>
				</div>
				<div className={style.content}>
					{!isEditing ? (
						<Viewer currentPost={currentPost} isEditing={setIsEditing}></Viewer>
					) : (
						<Editor currentPost={currentPost} setCurrentPost={setCurrentPost} isEditing={setIsEditing}></Editor>
					)}
				</div>
			</main>
		</>
	);
}

export default App;
