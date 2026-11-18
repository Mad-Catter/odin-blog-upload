import DOMpurify from 'dompurify';

function Viewer({ currentPost, isEditing }) {
	const lastInternalUpdate = new Date(currentPost.lastInternalUpdate);
	const publishedDate = new Date(currentPost.publishedDate);
	const uploadDate = new Date(currentPost.uploadDate);
	const lastPublicUpdate = new Date(currentPost.uploadDate);
	return (
		<div className="viewer">
			<div className="statusBar">
				<p>Currently Published: {currentPost.published ? 'Yes' : 'No'}</p>
				<p>Last internal update: {lastInternalUpdate.toLocaleString() || uploadDate.toLocaleString()}</p>
				<p>Uploaded on: {uploadDate.toLocaleString()}</p>
			</div>
			<div className="post">
				<h1>{currentPost.title}</h1>
				<div className="publishDivider">
					{currentPost.lastPublicUpdate && <p>Last Updated on: {lastPublicUpdate.toLocaleString()}</p>}
					<p>Published: {publishedDate.toLocaleDateString() || 'Not published'}</p>
				</div>
				<div className="contentDiv" dangerouslySetInnerHTML={{ __html: DOMpurify.sanitize(currentPost.content) }}></div>
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
