import M from "materialize-css";
import { useCallback, useEffect } from "react";

const SongFormLyric = ({ lyric, setLyric }) => {
	const resizeForPreviousLyric = useCallback(() => {
		if (lyric) {
			let textarea = document.querySelector("textarea");
			setTimeout(() => M.textareaAutoResize(textarea), 500);
		}
	}, [lyric]);

	useEffect(() => {
		resizeForPreviousLyric();
	}, [resizeForPreviousLyric]);

	return (
		<div className="row">
			<div className="input-field">
				<textarea
					id="lyric"
					name="lyric"
					className="materialize-textarea"
					onChange={(e) => setLyric(e.target.value)}
					value={lyric || ""}
				/>
				<label htmlFor="lyric" className="lab">
					Copiar y pegar letra sin acordes
				</label>
			</div>
		</div>
	);
};

export default SongFormLyric;
