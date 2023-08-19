import { useEffect, useState } from "react";
import M from "materialize-css";
import styled from "styled-components";
import LabelsInput from "./LabelsInput";
import { CollectionItem } from "../../styles/styles";
import { colors } from "../../styles/styleUtils";
import { setFunc } from "../../utils/types";
import { TSong } from "../../classes/song/types";

export const CollectionSearcher = (p: {
	searchInput: string,
	setSearchInput: setFunc<string>,
	labels: TSong["labels"],
	setLabels: setFunc<TSong["labels"]>,
	handleClickSearchLyric: () => void,
}) => {
	const {
		searchInput,
		setSearchInput,
		labels,
		setLabels,
		handleClickSearchLyric,
	} = p;
	const [showFilters, setShowFilters] = useState(false);
	const [filterSelectors, setFilterSelectors] = useState<M.Collapsible | null>(
		null
	);
	// const [filteredSongs, setFilteredSongs] = useState(allSongLyric);

	useEffect(() => {
		if (!filterSelectors) {
			const element = document.querySelector(".collapsible");
			if (element instanceof HTMLUListElement) {
				const inst = M.Collapsible.init(element);
				setFilterSelectors(inst);
			}
		}
	}, [filterSelectors]);

	useEffect(() => {
		if (filterSelectors) {
			if (showFilters) {
				filterSelectors.open(0);
			} else {
				filterSelectors.close(0);
			}
		}
	}, [showFilters, filterSelectors]);

	return (
		<CollectionSearcherStyle showFilters={showFilters}>
			<div>
				<SearchIcon htmlFor="search-input" onClick={handleClickSearchLyric}>
					<i className="material-icons">search</i>
				</SearchIcon>
				<input
					onChange={(e) => setSearchInput(e.target.value)}
					id="search-input"
					type="search"
					placeholder="Buscar canción..."
					value={searchInput}
				/>
				<FilterBtn onClick={() => setShowFilters(!showFilters)}>
					Filtros
					<i className="material-icons">
						{showFilters
							? "keyboard_double_arrow_up"
							: "keyboard_double_arrow_down"}
					</i>
				</FilterBtn>
			</div>
			<Collapsible>
				<li>
					<CollapsibleBody>
						<LabelsInput labels={labels} updateLabels={setLabels} />
					</CollapsibleBody>
				</li>
			</Collapsible>
		</CollectionSearcherStyle>
	);
};

const SearchIcon = styled.label``;

const FilterBtn = styled.div`
	cursor: pointer;
	border-left: 1px solid #e0e0e0;
	padding-left: 15px;
	padding-right: 15px;
	font-size: 17px !important;

	i {
		padding-left: 10px;
	}
`;

const CollectionSearcherStyle = styled(CollectionItem).attrs({
	className: "nav-wrapper",
})<{showFilters:boolean}>`
	padding: 0 !important;
	padding-right: 0 !important;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-bottom: ${(props) =>
		props.showFilters ? "1px solid #e0e0e0" : "3px solid #1976d2"} !important;
	display: block !important;

	> div {
		position: relative;
		display: flex;
		border-bottom: 1px solid #e0e0e0;

		> label,
		div {
			min-width: 4rem;
			height: 90%;
			display: flex;
			align-items: center;
			justify-content: center;
			transform: none;
			color: ${colors.gray};
			font-size: 1rem;
			-webkit-transition: color 0.2s ease-out, -webkit-transform 0.2s ease-out;
			transition: color 0.2s ease-out, -webkit-transform 0.2s ease-out;
			transition: transform 0.2s ease-out, color 0.2s ease-out;
			transition: transform 0.2s ease-out, color 0.2s ease-out,
				-webkit-transform 0.2s ease-out;
			-webkit-transform-origin: 0% 100%;
			transform-origin: 0% 100%;
			text-align: initial;
			padding-top: 1rem;
			padding-bottom: 1rem;
		}

		#search-input {
			font-size: 17px !important;
			-webkit-transition: 0.3s background-color;
			transition: 0.3s background-color;
			height: inherit;
			flex: 1;
			margin: 0;
			border: 0;
			-webkit-box-shadow: none;
			box-shadow: none;
			padding-top: 1rem;
			padding-bottom: 1rem;
		}

		#search-input:focus-visible {
			outline: none;
		}
	}

	&:hover {
		background-color: #fff;
	}

	.label-icon {
		min-width: 4rem;
		height: 90%;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: none;
		color: ${colors.gray};
		font-size: 1rem;
		-webkit-transition: color 0.2s ease-out, -webkit-transform 0.2s ease-out;
		transition: color 0.2s ease-out, -webkit-transform 0.2s ease-out;
		transition: transform 0.2s ease-out, color 0.2s ease-out;
		transition: transform 0.2s ease-out, color 0.2s ease-out,
			-webkit-transform 0.2s ease-out;
		-webkit-transform-origin: 0% 100%;
		transform-origin: 0% 100%;
		text-align: initial;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}
`;
const Collapsible = styled.ul.attrs({
	className: "collapsible",
})`
	border: none;
	box-shadow: none;
	margin: 0;
`;
const CollapsibleBody = styled.div.attrs({
	className: "collapsible-body",
})`
	padding: 10px 20px 0 20px;
	/* transition: visibility 2s linear; */
`;

export default CollectionSearcher;
