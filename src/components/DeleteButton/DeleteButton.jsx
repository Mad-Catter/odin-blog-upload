import { useRef } from 'react';
import style from './DeleteButton.module.css';
function DeleteButton({ fn, text, disabled }) {
	const dialogRef = useRef(null);
	return (
		<div className={style.deleteDiv}>
			<button type="button" onClick={() => dialogRef.current.show()} disabled={disabled}>
				{text}
			</button>
			<dialog ref={dialogRef}>
				<button type="button" onClick={() => fn()}>
					Confirm
				</button>
				<button type="button" onClick={() => dialogRef.current.close()}>
					Cancel
				</button>
			</dialog>
		</div>
	);
}

export default DeleteButton;
