import styled from "styled-components";

const SkewedDiagonal = styled.div`
  position: absolute;
  top: -60%;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bgSecondaryColor};
  z-index: 0;
  transform: skewY(-5deg);
  transform-origin: top left;
`;

export default SkewedDiagonal;
