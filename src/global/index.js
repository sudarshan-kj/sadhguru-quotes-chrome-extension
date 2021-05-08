import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }


  .mainContainer {
    background: ${({ theme }) => theme.bgPrimaryColor};
    color: ${({ theme }) => theme.textColor};
  }

  `;
