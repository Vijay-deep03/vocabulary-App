import React from "react";
import styled from "styled-components";

const Button2 = () => {
  return (
    <StyledWrapper>
      <button>
        <p>𝖩𝖮𝖨𝖭 𝖬𝖤</p>
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          height={16}
          width={16}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    background-color: #1f2937;
    border: 1px solid #1bd0fe;
    padding: 0.5em 1em;
    width: fit-content; /* Adjusts width to content */
    height: 2.5em;
    transition: 0.5s;
    font-size: 17px;
    border-radius: 0.4em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em; /* Space between text & icon */
    cursor: pointer;
  }

  button p {
    margin: 0;
    padding: 0;
    color: #fff;
    transition: 0.5s;
  }

  button svg {
    margin: 0;
    padding: 0;
    opacity: 0;
    transition: 0.5s;
    height: 1em;
    fill: #fff;
  }

  button:hover {
    background-color: #1bd0fe;
  }

  button:hover p {
    color: #1f2937;
  }

  button:hover svg {
    opacity: 1;
    fill: #1f2937;
  }
`;

export default Button2;
