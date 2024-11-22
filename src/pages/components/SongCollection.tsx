import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionSearcher } from "./CollectionSearcher.js";
import {
	Collection,
	CollectionContent,
	CollectionItem,
	CollectionItemDescription,
	CollectionItemIcons,
	PrivacyIcon,
	LevelIcon,
	CollectionItemLyric,
} from "../../styles/styles.js";
import { TSong, TSongId } from "../../classes/song/types.d";
import { arrayIsEmpty } from "../../utils/generalUtils.js";
import { useSelector } from "react-redux";
import { TRootState } from "../../store.js";

const SongCollection: FC<{
	songList?: TSong[];
	loading?: boolean;
	error?: string | null;
	searcher?: boolean;
	labelsStart?: Array<string>;
	checking?: boolean;
	pageName?: string;
}> = ({
	songList = [],
	loading = false,
	error = null,
	searcher = false,
	labelsStart = [],
	checking = false,
	pageName = "Cancionero",
}) => {
	const userId = useSelector((state: TRootState) => state.user.google.id);
	const navigate = useNavigate();

	const [songChoose, setSongChoose] = useState<TSongId | null>(null);
	const [lirycStartList, setLirycStartList] = useState<{
		[key: TSongId]: string;
	}>({});
	const [labels, setLabels] = useState(labelsStart);
	const [searchInput, setSearchInput] = useState("");
	const [filteredSongList, setFilteredSongList] = useState<TSong[]>([]);

	const containerContentRef = useRef<HTMLDivElement | null>(null);

	// useEffect(() => {
	// 	if (!songList.length) return
		
	// 	let newFilteredSongList = [...songList];
	// 	if (!!searchInput && !!searcher) {
	// 		newFilteredSongList = newFilteredSongList.filter((song) =>
	// 			(song.title + " " + song.lyricStart).toUpperCase().includes(searchInput.toUpperCase())
	// 		);
	// 	}
	// 	setFilteredSongList(newFilteredSongList);
	// }, [songList, searcher, searchInput]);

	useEffect(() => {
		if (!containerContentRef.current || !songList.length) return
		
		const lyricStartMaxWidth = containerContentRef?.current?.offsetWidth - 90;
		if (!lyricStartMaxWidth) return
		
		const canvasContext = document.createElement("canvas").getContext("2d");
		if (!canvasContext) return
				
		canvasContext.font = "12px Arial";

		setLirycStartList(
			songList.reduce((prev, song) => {
				if (!song.lyricStart) return prev;

				let newLyricStart = song.lyricStart;
				while (
					canvasContext.measureText(newLyricStart).width >
					lyricStartMaxWidth
				) {
					newLyricStart = newLyricStart.split(" ").slice(0, -1).join(" ");
				}

				if (newLyricStart?.[newLyricStart?.length - 1] === ",")
					newLyricStart = newLyricStart?.slice(0, -1);

				return { ...prev, [song.id]: "| " + newLyricStart + "..." };
			}, {})
		);
	}, [containerContentRef, songList]);

	useEffect(() => {
		if (!songList.length) return
		
		if (songChoose) {
			const songChoosed: TSong | undefined = songList.find((song) => song.id === songChoose)
			if (songChoosed) setFilteredSongList([songChoosed]);
			return
		} 
		
		// Search Filter
		let startsTitle: TSong[] = [];
		let includesTitle: TSong[] = [];
		let includesStartLyric: TSong[] = [];
		let includesLyric: TSong[] = [];
		
		songList.forEach((song) => {
			// Label Filter
			if (!labels.every((elem) => song.labels.includes(elem))) return
			
			if (
				searchInput === "" ||
				song.title.toLowerCase().startsWith(searchInput.toLowerCase())
			) {
				startsTitle.push(song);
			} else if (
				song.title.toLowerCase().includes(searchInput.toLowerCase())
			) {
				includesTitle.push(song);
			} else if (
				song.lyricStart?.toLowerCase?.()?.includes?.(searchInput.toLowerCase())
			) {
				includesStartLyric.push(song);
			} else if (
				song.lyric?.toLowerCase?.()?.includes?.(searchInput.toLowerCase())
			) {
				includesLyric.push(song);
			}
		});

		setFilteredSongList([...startsTitle, ...includesTitle, ...includesStartLyric, ...includesLyric]);
	}, [songList, searchInput, labels, songChoose]);

	const handleClickSearchLyric = () => {};

	const handleClickSong = (id: TSongId) => {
		navigate(`/song/${id}`, {
			state: { from: pageName },
		});
	};

	const handleCheck = (e: MouseEvent, songId: TSongId) => {
		e.preventDefault();
		e.stopPropagation();

		if (songId === songChoose) {
			const songItemCheckboxInput = document.getElementById(songId);
			if (songItemCheckboxInput instanceof HTMLInputElement) {
				setSongChoose(null);
				songItemCheckboxInput.checked = false;
			}
		} else {
			const songItemCheckboxInput = document.getElementById(songId);
			if (songItemCheckboxInput instanceof HTMLInputElement) {
				setSongChoose(songId);
				songItemCheckboxInput.checked = true;
			}
		}
	};

	if (loading)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	if (!!error) return <div>Error - {error}</div>;

	return (
		<Collection>
			{searcher && (
				<CollectionSearcher
					searchInput={searchInput}
					setSearchInput={setSearchInput}
					labels={labels}
					setLabels={setLabels}
					handleClickSearchLyric={handleClickSearchLyric}
				/>
			)}
			{/* {filteredSongs.map((song) => (
				<Link
					to={{ pathname: `/song/${song.id}`, state: { from: "Cancionero" } }}
					key={song.id}
					className={`collection-item ${checking ? "with-check" : ""}`}
				>
					<span className="song-item">
						{song.title}
						{song.author.name && ` - ${song.author.name}`}
					</span>
					{checking && (
						<label onClick={(e) => handleCheck(e, song.id)}>
							<input
								type="checkbox"
								id={song.id}
								className="filled-in checkbox-blue"
							/>
							<span />
						</label>
					)}
				</Link>
			))} */}
			<CollectionContent ref={containerContentRef}>
				{arrayIsEmpty(filteredSongList) && (
					<CollectionItem $withCheck={false}>Sin canciones.</CollectionItem>
				)}
				{filteredSongList.map((song) => (
					<CollectionItem
						key={song.id}
						onClick={() => handleClickSong(song.id)}
						$withCheck={checking}
					>
						<CollectionItemDescription>
							{song.title}
							{song?.author?.name && ` - ${song.author.name}`}
							{userId && (
								<CollectionItemIcons $withCheck={checking}>
									{!!song?.level?.general && (
										<LevelIcon $withCheck={checking}>
											<i className="material-icons">favorite_border</i>
											<span>
												{song?.level?.general
													? song?.level?.general?.toString()
													: ""}
											</span>
										</LevelIcon>
									)}
									{song?.creator?.id === userId && (
										<PrivacyIcon $withCheck={checking}>
											<i className="material-icons">
												{!!song?.isPrivate ? "lock" : "public"}
											</i>
										</PrivacyIcon>
									)}
								</CollectionItemIcons>
							)}
							{/* <div className="levelIcon">
									<i className="material-icons" style={{ color: "#5a5a5a" }}>
										favorite_border
									</i>
								</div> */}
							{checking && (
								<label onClick={(e) => handleCheck(e, song.id)}>
									<input
										type="checkbox"
										id={song.id}
										className="filled-in checkbox-blue"
									/>
									<span />
								</label>
							)}
						</CollectionItemDescription>
						{!!lirycStartList[song.id] && (
							<CollectionItemLyric>
								{lirycStartList[song.id]}
							</CollectionItemLyric>
						)}
					</CollectionItem>
				))}
			</CollectionContent>
			{/* {!filteredSongs && allSongDetails && (
				<div className="collection-item">
					<span className="song-item">Ninguna canción coincide...</span>
				</div>
			)} */}
		</Collection>
	);
};

export default SongCollection;
