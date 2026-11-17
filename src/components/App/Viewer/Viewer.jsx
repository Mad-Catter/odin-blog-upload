function Viewer({ currentPost, isEditing }) {
	return (
		<div className="viewer">
			<div className="statusBar">
				<p>Currently Published: {currentPost.published ? 'Yes' : 'No'}</p>
				<p>Last internal update: {currentPost.lastInternalUpdate || currentPost.uploadDate}</p>
				<p>Uploaded on: {currentPost.uploadDate}</p>
			</div>
			<div className="post">
				<h1>{currentPost.title}</h1>
				<div className="publishDivider">
					{currentPost.lastPublicUpdate && <p>Last Updated on: {currentPost.lastPublicUpdate}</p>}
					{/* This intentionally uses the publishedDate instead of the uploaded date.
                    I want admins to be able to change what published date the user sees. */}
					<p>uploaded on: {currentPost.publishedDate || 'Not published'}</p>
				</div>
				<p>{currentPost.content}</p>
			</div>
			<div className="buttons">
				<button
					type="button"
					onClick={() => {
						console.log(currentPost);
					}}
				>
					Logging
				</button>
				<button type="button" onClick={() => isEditing((status) => !status)}>
					Edit?
				</button>
			</div>
		</div>
	);
}

export default Viewer;
