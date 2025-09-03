import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styled from 'styled-components';

const ProgressBar = ({ step, onChange, funcao }) => {
  

  const steps = [
    { icon: 'bi-clock-history', label: 'Chamado não iniciado' },
    { icon: 'bi-wrench-adjustable', label: 'Em andamento' },
    { icon: 'bi-check-lg', label: 'Concluído' },
  ];

  return (
    <Wrapper $isTech={funcao === 'técnico'}>
      {steps.map((s, index) => (
        <Step
          key={index}
          active={step >= index}
          $isTech={funcao === 'técnico'}
          onClick={funcao === 'técnico' ? () => onChange(index) : undefined}
          title={s.label}
        >
          <i className={`bi ${s.icon}`}></i>
          {index < steps.length - 1 && (
            <Bar active={step > index} />
          )}
        </Step>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isTech',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$isTech ? 'pointer' : 'default')};
`;

const Step = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active', '$isTech'].includes(prop),
})`
  display: flex;
  align-items: center;
  position: relative;
  cursor: ${(props) => (props.$isTech ? 'pointer' : 'default')};

  i {
    font-size: 1.2rem;
    color: #fff;
    background-color: ${(props) => (props.active ? '#931c1b' : '#ccc')};
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    display: flex;
    transition: 0.3s;
  }

  ${(props) =>
    props.$isTech &&
    `
    &:hover i {
      transform: scale(1.1);
    }
  `}
`;

const Bar = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  height: 0.4rem;
  width: 1rem;
  background-color: ${(props) => (props.active ? '#931c1b' : '#ccc')};
  transition: 0.3s;
`;

export default ProgressBar;