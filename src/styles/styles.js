import styled from "styled-components";

export const Header = styled.div`
	display: flex;
	align-items: center;
	margin: 20px 0 20px 0;

    h3 {
        flex: 1;
	    margin: 0;

        @media (max-width: 800px) {
		    font-size: 2.6rem;
        }

        @media (max-width: 600px) {
            font-size: 2rem;
        }
    }
`;