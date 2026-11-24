import { useRef } from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import { useRevalidator } from 'react-router';
import { nanoid } from 'nanoid';
import style from './Editor.module.css';
import DeleteButton from '../../DeleteButton/DeleteButton';
function Editor({ currentPost, setCurrentPost, isEditing, error, setError }) {
	// With all the refs I am using, it might just be best to make these fields controlled.
	const publishedRef = useRef(null);
	const editorRef = useRef(null);
	const formRef = useRef(null);
	const revalidator = useRevalidator();
	function saveDraft() {
		const formData = new FormData(formRef.current);
		const payload = Object.fromEntries(formData);
		const data = { ...currentPost };
		data.title = payload.title || 'Untitled Draft:' + new Date().toLocaleString();
		data.published = publishedRef.current.checked;
		data.content = editorRef.current.getContent();
		data.draftId = currentPost.draftId ? currentPost.draftId : nanoid(10);
		if (currentPost.id) data.id = currentPost.id;
		data.lastInternalUpdate = new Date();
		let drafts = localStorage.getItem('drafts');
		drafts = JSON.parse(drafts) || {};
		drafts[data.draftId] = data;
		localStorage.setItem('drafts', JSON.stringify(drafts));
		setCurrentPost(data);
	}
	function deleteDraft() {
		let drafts = localStorage.getItem('drafts');
		drafts = JSON.parse(drafts) || {};
		delete drafts[currentPost.draftId];
		localStorage.setItem('drafts', JSON.stringify(drafts));
		setCurrentPost({});
	}
	async function submit(formData) {
		const currentId = currentPost.id ? '/' + currentPost.id : '';
		// Patch is for updating posts, if there is no current post we want to post a new post instead
		const method = currentPost.id ? 'PATCH' : 'POST';
		const url = import.meta.env.VITE_API + '/posts' + currentId;
		const token = localStorage.getItem('authToken');
		formData.set('published', publishedRef.current.checked);
		const payload = Object.fromEntries(formData);
		try {
			const response = await fetch(url, {
				method: method,
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
				body: JSON.stringify(payload),
			});
			if (!response.ok) {
				const body = await response.json().catch(() => null);
				const message = body?.message || body?.error || response.statusText;
				const err = new Error(message);
				err.status = response.status;
				err.details = body;
				throw err;
			}
			// const json = await response.json();
			if (currentPost.draftId) {
				deleteDraft();
			}
			setError({});
			revalidator.revalidate();
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
			console.log(error.details.errors.errors);
			setError(error.details);
		}
	}
	async function deletePost() {
		const url = import.meta.env.VITE_API + '/posts/' + currentPost.id;
		const token = localStorage.getItem('authToken');
		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			});
			if (!response.ok) {
				const body = await response.json().catch(() => null);
				const message = body?.message || body?.error || response.statusText;
				const err = new Error(message);
				err.status = response.status;
				err.details = body;
				throw err;
			}
			// If a draft has an id, when it gets posted it will try to update a deleted post which will cause issues.
			// I could delete all drafts associated with a post (that might be a better way) but I set the current behavior to merely clear the id of the draft
			// So they will be treated as a new post if their parent gets deleted.
			let drafts = localStorage.getItem('drafts');
			drafts = JSON.parse(drafts) || {};
			const draftValues = Object.values(drafts);
			draftValues.map((draft) => {
				if (draft.id === currentPost.id) {
					delete drafts[draft.draftId].id;
				}
			});
			localStorage.setItem('drafts', JSON.stringify(drafts));
			setCurrentPost({});
			revalidator.revalidate();
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
		}
	}
	return (
		<div className={style.editor}>
			<div className={style.viewDiv}>
				<button type="button" onClick={() => isEditing((status) => !status)}>
					View
				</button>
			</div>
			{/* This key is so that the defaultValues get reset each time the currentPost changes.  Because I am already using key for the post views I added form to it.
			I could also change this whole form to a controlled state but I am unsure if that is wise or not. */}
			<form action={submit} key={'form' + currentPost.id} ref={formRef}>
				<div className={style.formLabels}>
					<label htmlFor="title">Title:</label>
					<input type="text" name="title" id="title" defaultValue={currentPost.title} />
					<br />
					<br />
					<label htmlFor="content">Content:</label>
				</div>
				<TinyEditor
					onInit={(_evt, editor) => (editorRef.current = editor)}
					apiKey={import.meta.env.VITE_TINY_KEY}
					initialValue={currentPost.content}
					init={{
						height: 600,
						width: 600,
						menubar: 'format edit',
						content_style: 'body {font-size: 1.25rem;}',
					}}
					textareaName="content"
					id="content"
				></TinyEditor>
				<div className={style.checkboxes}>
					<div className="inputdiv">
						<label htmlFor="published">Publish?</label>
						<input
							type="checkbox"
							name="published"
							id="published"
							defaultChecked={currentPost.published ? true : false}
							ref={publishedRef}
						/>
					</div>

					{currentPost.publishedDate && (
						<div className="publicUpdateDiv">
							<label htmlFor="publicUpdate">Have this edit show as a public update?</label>
							<input type="checkbox" name="publicUpdate" id="publicUpdate" />
						</div>
					)}
				</div>
				{error.message && (
					<div className={style.errorDiv}>
						<h2>{error.message}</h2>
						{error.errors.errors && (
							<ul>
								<p>Please fix these errors:</p>
								{error.errors.errors.map((error) => {
									return <li key={error.msg}>{error.msg}</li>;
								})}
							</ul>
						)}
					</div>
				)}
				<div className={style.saveButtons}>
					<button type="button" onClick={saveDraft}>
						Save Draft
					</button>
					<button type="submit">Submit</button>
				</div>
				{(currentPost.id || currentPost.draftId) && (
					<div className={style.deleteDiv}>
						<DeleteButton
							fn={currentPost.draftId ? deleteDraft : deletePost}
							text={currentPost.draftId ? 'Delete Draft' : 'Delete Post'}
						/>
					</div>
				)}
			</form>
		</div>
	);
}

export default Editor;
