import React, {MouseEvent} from 'react';
import styled from 'styled-components';

interface Props {
  fontsize?: number;
  color?: string;
  backgroundColor?: string;
  label: string;
  onPress: (event: MouseEvent) => void;
}

const Button = ({
  label,
  onPress,
  fontsize = 12,
  color = '#67c5ff',
  backgroundColor = '#fff',
}: Props) => {
  return (
    <StyledButton
      fontsize={fontsize}
      color={color}
      backgroundColor={backgroundColor}
      onClick={onPress}
    >
      {label}
    </StyledButton>
  );
};

const StyledButton = styled.button<{fontsize: number; color: string; backgroundColor: string}>`
  display: inline-block;
  padding: 0.3em 1em;
  text-decoration: none;
  font-size: ${props => `${props.fontsize}px`}
  color: ${props => props.color};
  background: ${props => props.backgroundColor};
  border: solid 2px ${props => props.color};
  border-radius: 3px;
  transition: .4s;
  &:hover {
    background: ${props => props.color};
    color: ${props => props.backgroundColor};
  }
`;

export default Button;
