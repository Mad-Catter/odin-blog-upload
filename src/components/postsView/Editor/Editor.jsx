import { useRef } from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import { useRevalidator } from 'react-router';
import { nanoid } from 'nanoid';
function Editor({ currentPost, setCurrentPost, isEditing }) {
	// With all the refs I am using, it might just be best to make these fields controlled.
	const publishedRef = useRef(null);
	const editorRef = useRef(null);
	const formRef = useRef(null);
	const revalidator = useRevalidator();
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
				// Error bodies aren't always JSON (proxies, 502s, etc.), so fall back safely
				const body = await response.json().catch(() => null);
				const message = body?.message || body?.error || response.statusText;
				const err = new Error(message);
				err.status = response.status;
				err.details = body;
				throw err;
			}
			const json = await response.json();
			if (currentPost.draftId) {
				let drafts = localStorage.getItem('drafts');
				drafts = JSON.parse(drafts) || {};
				delete drafts[currentPost.draftId];
				localStorage.setItem('drafts', JSON.stringify(drafts));
			}
			revalidator.revalidate();
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
		}
	}
	function saveDraft() {
		const formData = new FormData(formRef.current);
		const payload = Object.fromEntries(formData);
		const data = { ...currentPost };
		data.title = payload.title || 'Untitled Draft:' + new Date().toLocaleString();
		data.published = publishedRef.current.checked;
		data.content = editorRef.current.getContent();
		data.draftId = currentPost.draftId ? currentPost.draftId : nanoid(10);
		if (currentPost.id) data.id = currentPost.id;
		let drafts = localStorage.getItem('drafts');
		drafts = JSON.parse(drafts) || {};
		drafts[data.draftId] = data;
		localStorage.setItem('drafts', JSON.stringify(drafts));
		setCurrentPost(data);
	}
	return (
		<>
			{/* This key is so that the defaultValues get reset each time the currentPost changes.  Because I am already using key for the post views I added form to it.
			I could also change this whole form to a controlled state but I am unsure if that is wise or not. */}
			<form action={submit} key={'form' + currentPost.id} ref={formRef}>
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" defaultValue={currentPost.title} />
				<br />
				<br />
				<label htmlFor="content">Content:</label>
				<TinyEditor
					onInit={(_evt, editor) => (editorRef.current = editor)}
					apiKey={import.meta.env.VITE_TINY_KEY}
					initialValue={currentPost.content}
					init={{
						height: 500,
						width: 500,
						menubar: 'format edit',
					}}
					textareaName="content"
					id="content"
				></TinyEditor>
				<label htmlFor="published">Publish?</label>
				<input
					type="checkbox"
					name="published"
					id="published"
					defaultChecked={currentPost.published ? true : false}
					ref={publishedRef}
				/>
				{currentPost.publishedDate && (
					<div className="publicUpdateDiv">
						<label htmlFor="publicUpdate">Have this edit show as a public update?</label>
						<input type="checkbox" name="publicUpdate" id="publicUpdate" />
					</div>
				)}
				<button type="submit">Submit</button>
			</form>
			<button type="button" onClick={() => isEditing((status) => !status)}>
				Back to view
			</button>
			<button type="button" onClick={saveDraft}>
				Save Draft
			</button>
			{/* TODO DELETE POST */}
		</>
	);
}

export default Editor;
