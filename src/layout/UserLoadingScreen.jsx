import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const UserLoadingScreen = ({ loading }) => {
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		if (loading) {
			setShowLoader(true);
		} else {
			setTimeout(() => {
				setShowLoader(false);
			}, 2000);
		}
	}, [loading]);

	return showLoader ? (
		<FullScreenBackground loading={loading.toString()}>
			<div>
				<div className="preloader-wrapper big active">
					<div className="spinner-layer spinner-blue-only">
						<div className="circle-clipper left">
							<div className="circle"></div>
						</div>
						<div className="gap-patch">
							<div className="circle"></div>
						</div>
						<div className="circle-clipper right">
							<div className="circle"></div>
						</div>
					</div>
				</div>
			</div>
		</FullScreenBackground>
	) : null;
};

const FullScreenBackground = styled.div`
	position: fixed;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
	background-color: #ffffff0;
	transition: background-color 0.5s ease-in-out;

	> div {
		width: 0px !important;
		height: 0px !important;
		transition: width 0.5s ease-in-out, height 0.5s ease-in-out;

		> .preloader-wrapper {
			width: 100% !important;
			height: 100% !important;
		}
	}

	${(props) =>
		props.loading === "true" &&
		css`
			background-color: #ffffffe0;

			> div {
				width: 64px !important;
				height: 64px !important;
			}
		`}
`;

export default UserLoadingScreen;
