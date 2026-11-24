import DOMpurify from 'dompurify';
import style from './Viewer.module.css';

function Viewer({ currentPost, isEditing }) {
	const lastInternalUpdate = new Date(currentPost.lastInternalUpdate);
	const publishedDate = new Date(currentPost.publishedDate);
	const uploadDate = new Date(currentPost.uploadDate);
	const lastPublicUpdate = new Date(currentPost.uploadDate);
	return (
		<div className={style.viewer}>
			{(currentPost.id || currentPost.draftId) && (
				<>
					{' '}
					<header className={style.statusBar}>
						<p>Currently Published: {currentPost.published ? 'Yes' : 'No'}</p>
						<p>Last internal update: {lastInternalUpdate.toLocaleString() || uploadDate.toLocaleString()}</p>
						<p>Uploaded on: {uploadDate.toLocaleString()}</p>
					</header>
					<div className={style.post}>
						<div className={style.buttons}>
							<button type="button" onClick={() => isEditing((status) => !status)}>
								Edit
							</button>
						</div>
						<h1>{currentPost.title}</h1>
						<div className={style.publishDivider}>
							<p className={style.publishedStatus}>
								Published: {currentPost.publishedDate ? publishedDate.toLocaleDateString() : 'Not published'}
							</p>
							{currentPost.lastPublicUpdate && <p>Last Updated on: {lastPublicUpdate.toLocaleString()}</p>}
						</div>
						<div
							className={style.contentDiv}
							dangerouslySetInnerHTML={{ __html: DOMpurify.sanitize(currentPost.content) }}
						></div>
					</div>
				</>
			)}
		</div>
	);
}

export default Viewer;
