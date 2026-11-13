import style from './Sidebar.module.css';

function Sidebar({ posts, setCurrentPost }) {
	return (
		<div className={style.sidebar}>
			<button type="button">Make new post</button>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<button type="button" onClick={() => setCurrentPost(post.id)}>
							{post.title}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Sidebar;
