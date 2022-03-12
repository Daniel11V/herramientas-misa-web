const SongFormDescription = ({ author, setAuthor, title, setTitle }) => {
	return (
		<>
			<div className="row">
				<div className="input-field">
					<input
						id="author"
						name="author"
						onChange={(e) => setAuthor(e.target.value)}
						type="text"
						value={author || ""}
					/>
					<label htmlFor="author" className="lab">
						Autor
					</label>
				</div>
			</div>
			<div className="row">
				<div className="input-field">
					<input
						id="title"
						name="title"
						onChange={(e) => setTitle(e.target.value)}
						type="text"
						value={title || ""}
					/>
					<label htmlFor="title" className="lab">
						Titulo
					</label>
				</div>
			</div>
		</>
	);
};

export default SongFormDescription;
