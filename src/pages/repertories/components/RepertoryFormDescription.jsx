import styled from "styled-components";
import SelectorModal from "./SelectorModal";

const RepertoryFormDescription = ({
	author,
	setAuthor,
	authorItems,
	authorForm,
	setAuthorField,
	title,
	setTitle,
	annotations,
	setAnnotations,
}) => {
	return (
		<>
			<div className="row">
				<div className="input-field">
					{/* Replace with selector */}
					<label htmlFor="author" className={"lab" + (author ? " active" : "")}>
						Autor
					</label>
					<SelectorModal
						selectedItem={author}
						setSelectedItem={setAuthor}
						items={authorItems}
					/>
				</div>
			</div>
			{author.value === "Other" && (
				<>
					<div className="row">
						<div className="input-field">
							<input
								id="authorName"
								name="authorName"
								onChange={(e) => setAuthorField("name", e.target.value)}
								type="text"
								value={authorForm.name || ""}
							/>
							<label
								htmlFor="authorName"
								className={"lab" + (authorForm.name ? " active" : "")}
							>
								Nombre del artista*
							</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field">
							<input
								id="authorEmail"
								name="authorEmail"
								onChange={(e) => setAuthorField("email", e.target.value)}
								type="text"
								value={authorForm.email || ""}
							/>
							<label
								htmlFor="authorEmail"
								className={"lab" + (authorForm.email ? " active" : "")}
							>
								Email del artista
							</label>
						</div>
					</div>
					<div className="row">
						<AuthorPhotoField>
							<input
								id="authorPhotoUrl"
								name="authorPhotoUrl"
								onChange={(e) => setAuthorField("photoUrl", e.target.value)}
								type="text"
								value={authorForm.photoUrl || ""}
							/>
							<label
								htmlFor="authorPhotoUrl"
								className={"lab" + (authorForm.photoUrl ? " active" : "")}
							>
								Link a imagen de google
							</label>
							<AuthorPhotoUrl src={authorForm.photoUrl} />
						</AuthorPhotoField>
					</div>
				</>
			)}
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

const AuthorPhotoField = styled.div.attrs({
	className: "input-field",
})`
	display: flex;
	margin-bottom: 30px;

	input {
		flex: 1;
	}
`;

const AuthorPhotoUrl = styled.div`
	padding: 0 !important;
	width: 50px !important;
	height: 50px !important;
	margin-left: 15px !important;
	margin-top: -5px;
	border-radius: 100%;
	background-image: url(${(props) => props.src}),
		url("https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
`;

export default RepertoryFormDescription;
