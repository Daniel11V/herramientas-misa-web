
const RepertoryFormDescription = ({
	title,
	setTitle,
	placeTitle,
	setPlaceTitle,
	placeUbication,
	setPlaceUbication,
	annotations,
	setAnnotations,
	setIsMass,
}) => {
	return (
		<>
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
			<div className="row">
				<div className="input-field">
					<input
						id="placeTitle"
						name="placeTitle"
						onChange={(e) => setPlaceTitle(e.target.value)}
						type="text"
						value={placeTitle || ""}
					/>
					<label htmlFor="placeTitle" className={"lab" + (placeTitle ? " active" : "")}>
						Titulo de la Ubicacion
					</label>
				</div>
			</div>
			<div className="row">
				<div className="input-field">
					<input
						id="placeUbication"
						name="placeUbication"
						onChange={(e) => setPlaceUbication(e.target.value)}
						type="text"
						value={placeUbication || ""}
					/>
					<label htmlFor="placeUbication" className={"lab" + (placeUbication ? " active" : "")}>
						Url de la Ubicacion
					</label>
				</div>
			</div>
			<div
				className="switch"
				style={{
					marginBottom: "40px",
				}}
			>
				<label onChange={setIsMass}>
					<input type="checkbox" id="checkAuto" />
					<span className="lever"></span>
					<span style={{ color: "black" }}>Usar plantilla para misas</span>
				</label>
			</div>
			<div className="row">
				<div className="input-field">
					<input
						id="annotations"
						name="annotations"
						onChange={(e) => setAnnotations(e.target.value)}
						type="text"
						value={annotations || ""}
					/>
					<label
						htmlFor="annotations"
						className={"lab" + (annotations ? " active" : "")}
					>
						Anotaciones
					</label>
				</div>
			</div>
		</>
	);
};

export default RepertoryFormDescription;
