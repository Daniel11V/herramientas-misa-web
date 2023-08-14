import M from "materialize-css";
import { useCallback, useEffect } from "react";

interface Props {
	lyric: string;
	setLyric: (lyric: string) => void;
}

export const SongFormLyric: React.FC<Props> = ({ lyric, setLyric }) => {
	const resizeForPreviousLyric = useCallback(() => {
		if (lyric) {
			let textarea = document.querySelector("#lyric");
			setTimeout(() => M.textareaAutoResize(textarea), 500);
		}
	}, [lyric]);

	useEffect(() => {
		resizeForPreviousLyric();
	}, [resizeForPreviousLyric]);

	return (
		<div className="input-field" style={{ marginBottom: 0 }}>
			<textarea
				id="lyric"
				name="lyric"
				className="materialize-textarea"
				onChange={(e) => setLyric(e.target.value)}
				value={lyric || ""}
				spellCheck="false"
			/>
			<label htmlFor="lyric" className={"lab" + (lyric ? " active" : "")}>
				Copiar y pegar letra con acordes
			</label>
		</div>
	);
};
