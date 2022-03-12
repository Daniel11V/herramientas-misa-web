import React, { useState } from "react";

import styled from "styled-components";

const Tooltip = ({ child }) => {
	const Thing = styled.div`
		color: blue;

		&:hover {
			color: red; // <Thing> when hovered
		}
	`;

	return (
		<Thing>
			<div></div>
			{child}
		</Thing>
	);
};

export default Tooltip;
