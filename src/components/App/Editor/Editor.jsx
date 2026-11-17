import { useRef } from 'react';

function Editor({ currentPost, isEditing }) {
	const publishedRef = useRef(null);
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
				err.details = body; // keep the full body in case you need field-level errors
				throw err;
			}
			const json = await response.json();
			// I should maybe change this?
			window.location.reload();
		} catch (error) {
			console.error(`Request failed (${error.status ?? 'network error'}):`, error.message);
		}
	}
	return (
		<>
			{/* This key is so that the defaultValues get reset each time the currentPost changes.  Because I am already using key for the post views I added form to it.
			I could also change this whole form to a controlled state but I am unsure if that is wise or not. */}
			<form action={submit} key={'form' + currentPost.id}>
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" defaultValue={currentPost.title} />
				<label htmlFor="content">Content:</label>
				<textarea name="content" id="title" defaultValue={currentPost.content} />

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
				Edit?
			</button>
		</>
	);
}

export default Editor;
