const SongFormLabels = ({ lyric, setLyric }) => {
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

export default SongFormLabels;
