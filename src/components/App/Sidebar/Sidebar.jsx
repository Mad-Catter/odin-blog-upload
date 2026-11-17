import style from './Sidebar.module.css';

function Sidebar({ posts, setCurrentPost, setIsEditing }) {
	function newPostButton() {
		setCurrentPost({});
		setIsEditing(true);
	}
	return (
		<div className={style.sidebar}>
			<button type="button" onClick={newPostButton}>
				Make new post
			</button>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<button type="button" onClick={() => setCurrentPost(post)}>
							{post.title}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Sidebar;
