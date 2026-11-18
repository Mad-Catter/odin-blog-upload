import style from './Sidebar.module.css';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
function Sidebar({ posts, setCurrentPost, setIsEditing }) {
	const revalidator = useRevalidator();
	function newPostButton() {
		setCurrentPost({});
		setIsEditing(true);
	}
	const [filterPublish, setFilterPublish] = useState('any');
	const [viewingDrafts, setViewingDrafts] = useState(false);
	let draftPosts = localStorage.getItem('drafts');
	draftPosts = JSON.parse(draftPosts) || {};
	draftPosts = Object.values(draftPosts);
	const unfilteredPosts = viewingDrafts ? draftPosts : posts;
	// This is setup for each result to return false before finally returning true so that I can add more queries later
	const sidebarPosts = unfilteredPosts.filter((post) => {
		if (filterPublish === 'no' && post.published) return false;
		if (filterPublish === 'yes' && !post.published) return false;
		return true;
	});
	return (
		<div className={style.sidebar}>
			<div className="buttons">
				<button type="button" onClick={newPostButton}>
					Make new post
				</button>
				<button type="button" onClick={() => setViewingDrafts((current) => !current)}>
					Drafts
				</button>
			</div>
			<div className="postOptions">
				<form action="">
					<label htmlFor="">Published</label>
					<label htmlFor="truePublished">
						<input type="radio" name="published" id="truePublished" onChange={() => setFilterPublish('yes')} />
						Yes
					</label>
					<label htmlFor="falsePublished">
						<input type="radio" name="published" id="falsePublished" onChange={() => setFilterPublish('no')} />
						No
					</label>
					<label htmlFor="anyPublished">
						<input type="radio" name="published" id="anyPublished" onChange={() => setFilterPublish('any')} />
						Any
					</label>
					<p>{filterPublish}</p>
				</form>
				<button onClick={() => revalidator.revalidate()} disabled={revalidator.state === 'loading'}>
					{revalidator.state === 'loading' ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>
			<div className={style.list}>
				<ul>
					{/* I should sort drafts based on the last update */}
					{sidebarPosts.map((post) => (
						<li key={post.draftId || post.id}>
							<button type="button" onClick={() => setCurrentPost(post)}>
								{post.title}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
