import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styled from 'styled-components';

const ProgressBar = ({ step }) => {
  // step: 0 = não iniciado, 1 = em andamento, 2 = concluído
  const status ={
    'não iniciado': 0,
    'em andamento': 1,
    'concluído': 2,
  }

  const steps = [
    { icon: 'bi-clock-history', label: 'Chamado não iniciado' },
    { icon: 'bi-wrench-adjustable', label: 'Em andamento' },
    { icon: 'bi-check-lg', label: 'Concluído' },
  ];

  return (
    <Wrapper>
      {steps.map((s, index) => (
        <Step key={index} active={status[step] >= index}>
          <i className={`bi ${s.icon}`}></i>
          {index < steps.length - 1 && <Bar active={status[step] > index} />}
        </Step>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Step = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  display: flex;
  align-items: center;
  position: relative;
  i {
    font-size: 1.2rem;
    color: #FFFFFF;
    background-color: ${(props) => (props.active ? '#931c1b' : '#ccc')};
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    display: flex;
  }
`;

const Bar = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  height: 0.4rem;
  width: 1rem;
  background-color: ${(props) => (props.active ? '#931c1b' : '#ccc')};
`;

export default ProgressBar;
