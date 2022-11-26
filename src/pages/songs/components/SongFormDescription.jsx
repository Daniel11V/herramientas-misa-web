const SongFormDescription = ({ author, setAuthor, title, setTitle }) => {
	return (
		<>
			<div className="row">
				<div className="input-field">
					{/* Replace with selector */}
					<label htmlFor="author" className={"lab" + (author ? " active" : "")}>
						Autor
					</label>
					<input
						id="author"
						name="author"
						onChange={(e) => setAuthor(e.target.value)}
						type="text"
						value={author || ""}
					/>
					{/* <SelectorModal
						selectedItem={author}
						setSelectedItem={setAuthor}
					/> */}
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
					<label htmlFor="title" className={"lab" + (title ? " active" : "")}>
						Titulo*
					</label>
				</div>
			</div>
		</>
	);
};

export default SongFormDescription;
