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
	const [error, setError] = useState({});

	return (
		<>
			<Header></Header>
			<main>
				<Sidebar
					posts={posts}
					setCurrentPost={setCurrentPost}
					setIsEditing={setIsEditing}
					error={error}
					setError={setError}
				></Sidebar>
				<div className={style.content}>
					{!isEditing ? (
						<Viewer currentPost={currentPost} isEditing={setIsEditing}></Viewer>
					) : (
						<Editor
							currentPost={currentPost}
							setCurrentPost={setCurrentPost}
							isEditing={setIsEditing}
							error={error}
							setError={setError}
						></Editor>
					)}
				</div>
			</main>
		</>
	);
}

export default App;
