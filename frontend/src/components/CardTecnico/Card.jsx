"use client";
import "./card.css";
import { useEffect, useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import BtnChat from "@/components/BtnChatTecnico/Btnchat";
import Chat from "@/components/Chat/Chat.jsx";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckIcon from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

//Progress bar
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#e30615",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#e30615",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#818181",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#818181",
  zIndex: 1,
  color: "#fff",
  width: 30,
  height: 30,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: "#e30615",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: "#e30615",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <HourglassTopIcon style={{ height: "18" }} />,
    2: <ManageHistoryIcon style={{ height: "18" }} />,
    3: <CheckIcon style={{ height: "18" }} />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

export default function Card() {
  const [chamados, setChamados] = useState([]);
  const [chamadoUser, setChamadoUser] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/chamados")
      .then((response) => response.json())
      .then((informacao) => setChamados(informacao));

    const userId = localStorage.getItem('userid');

    const chamados_user = chamados.filter(
      (d) => parseInt(d.id_user) === userId
    );
    setChamadoUser(chamados_user);

  }, []);

  const ordemPrioridade = {
    1: "Intervenção Preventiva",
    2: "Intervenção Sem Urgência",
    3: "Intervenção Prioritária",
    4: "Intervenção Imediata",
  };

  const status = {
    pendente: 0,
    "em andamento": 1,
    concluído: 2,
  };

  function atualizacao(data) {
    const date = new Date(data);

    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  function MudarProgresso(id, status) {
    if (status === "Pendente") {
      fetch(`http://localhost:8080/chamados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Pendente" }),
      });
      console.log("Status alterado para Pendente");
      return;
    }
    if (status === "Em andamento") {
      fetch(`http://localhost:8080/chamados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Em andamento" }),
      });
      console.log("Status alterado para Em andamento");
      return;
    } else if (status === "Concluído") {
      fetch(`http://localhost:8080/chamados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Concluído" }),
      });
      setTimeout(() => {
        location.reload();
      }, 2000);
    
      console.log("Status alterado para Concluído");
      return;
    }
  }

  return (
    <>
      {chamados
        .sort((a, b) => {
          const statusA = status[a.status];
          const statusB = status[b.status];

          if (statusA === 2 && statusB !== 2) return 1;
          if (statusB === 2 && statusA !== 2) return -1;

          if (statusA !== 2 && statusB !== 2) {
            return parseInt(b.grau_prioridade) - parseInt(a.grau_prioridade);
          }
          return 0;
        })
        .map((chamado) => {
          if (status[chamado.status] == 2) {
            return (
              <React.Fragment key={chamado.id}>
                <div className="card-desativado">
                  <div
                    className={`card-prioridade-${chamado.grau_prioridade}  align-items-center justify-content-center d-flex`}
                  >
                    <p className="">
                      {ordemPrioridade[chamado.grau_prioridade]}
                    </p>
                  </div>

                  <main className="d-grid mt-4">
                    <div className="card-titulo align-items-center justify-content-center d-grid">
                      <h3>{chamado.titulo}</h3>
                    </div>

                    <div className="card-patrimonio w-100 d-grid justify-content-center align-items-center">
                      <p>{chamado.patrimonio}</p>
                    </div>
                  </main>

                  <div className="status-card d-flex align-items-center justify-content-center">
                    <p>{chamado.status}</p>
                  </div>

                  <div className="mb-3 align-items-center justify-content-center d-flex">
                    <Stack sx={{ width: "100%" }} spacing={4}>
                      <Stepper
                        alternativeLabel
                        key={chamado.id}
                        activeStep={status[chamado.status]}
                        connector={<ColorlibConnector />}
                      >
                        <Step>
                          <StepLabel
                            StepIconComponent={ColorlibStepIcon}
                          ></StepLabel>
                        </Step>
                        <Step>
                          <StepLabel
                            StepIconComponent={ColorlibStepIcon}
                          ></StepLabel>
                        </Step>
                        <Step>
                          <StepLabel
                            StepIconComponent={ColorlibStepIcon}
                          ></StepLabel>
                        </Step>
                      </Stepper>
                    </Stack>
                  </div>

                  <div className="accordion-item align-items-center justify-content-center d-grid w-100">
                    <div className="accordion-header align-items-center justify-content-center d-grid w-100">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapseOne-${chamado.id}`}
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        <i className="bi bi-caret-down-fill"></i>
                      </button>
                    </div>

                    <div
                      id={`flush-collapseOne-${chamado.id}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="card-descricao">
                        <p className="">
                          <b>Descrição:</b> {chamado.descricao}
                        </p>
                      </div>

                      <div className="chat-desativado align-items-center justify-content-center d-grid">
                        <div
                          type="button"
                          className="btn-desativado"
                          data-bs-toggle="modal"
                          data-bs-target={`#modal-${chamado.id}`}
                        >
                          <BtnChat />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id={`modal-${chamado.id}`}
                  tabIndex={-1}
                  aria-labelledby={`modalLabel-${chamado.id}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                      <h2>Informações do Chamado</h2>
                      <p>{chamado.titulo}</p>
                      <p>{chamado.tecnico}</p>
                      <p>{chamado.descricao}</p>
                      <p>{chamado.prioridade}</p>
                    </div>
                    <div className="modal-content">
                      <Chat />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={chamado.id}>
                <div className="card">
                  <div
                    className={`card-prioridade-${chamado.grau_prioridade}  align-items-center justify-content-center d-flex`}
                  >
                    <p className="">
                      {ordemPrioridade[chamado.grau_prioridade]}
                    </p>
                  </div>

                  <main className="d-grid mt-4">
                    <div className="card-titulo align-items-center justify-content-center d-grid">
                      <h3>{chamado.titulo}</h3>
                    </div>

                    <div className="card-patrimonio w-100 d-grid justify-content-center align-items-center">
                      <p>{chamado.patrimonio}</p>
                    </div>
                  </main>

                  <div className="status-card d-flex align-items-center justify-content-center">
                    <p>{chamado.status}</p>
                  </div>

                  <div className="mb-3 align-items-center justify-content-center d-flex">
                    <Stack sx={{ width: "100%" }} spacing={4}>
                      <Stepper
                        alternativeLabel
                        key={chamado.id}
                        activeStep={status[chamado.status]}
                        connector={<ColorlibConnector />}
                      >
                        {[0, 1, 2].map((stepIndex) => (
                          <Step key={stepIndex}>
                            {status[chamado.status] < stepIndex ? (
                              <StepLabel
                                StepIconComponent={ColorlibStepIcon}
                                onClick={() => {
                                  const statusText = Object.keys(status).find(
                                    (key) => status[key] === stepIndex
                                  );
                                  MudarProgresso(chamado.id, statusText);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            ) : (
                              <StepLabel StepIconComponent={ColorlibStepIcon} />
                            )}
                          </Step>
                        ))}
                      </Stepper>
                    </Stack>
                  </div>

                  <div className="accordion-item align-items-center justify-content-center d-grid w-100">
                    <div className="accordion-header align-items-center justify-content-center d-grid w-100">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapseOne-${chamado.id}`}
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        <i className="bi bi-caret-down-fill"></i>
                      </button>
                    </div>

                    <div
                      id={`flush-collapseOne-${chamado.id}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="card-descricao">
                        <p className="">
                          <b>Descrição:</b> {chamado.descricao}
                        </p>
                      </div>

                      <div className="card-atualizacao">
                        <p>
                          <b>Atualizado em:</b>
                          {atualizacao(chamado.atualizado_em)}
                        </p>
                      </div>

                      <div className="chat align-items-center justify-content-center d-grid">
                        <div
                          type="button"
                          className="btn"
                          data-bs-toggle="modal"
                          data-bs-target={`#modal-${chamado.id}`}
                        >
                          <BtnChat />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id={`modal-${chamado.id}`}
                  tabIndex={-1}
                  aria-labelledby={`modalLabel-${chamado.id}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2
                          className="modal-title"
                          id={`modalLabel-${chamado.id}`}
                        >
                          <b>Informações do Chamado:</b>
                        </h2>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>

                      <div className="modal-body d-flex">
                        <div className="d-grid gap-0 m-0">
                          <p className="d-grid">
                            <b className="m-0">Título: </b> {chamado.titulo}
                          </p>
                          <p className="d-grid">
                            <b className="m-0">Técnico responsável: </b>
                            {chamado.tecnico}
                          </p>
                          <p className="d-grid">
                            <b className="m-0">Descrição: </b>
                            {chamado.descricao}
                          </p>
                          <p className="d-grid">
                            <b className="m-0">Prioridade: </b>
                            {ordemPrioridade[chamado.grau_prioridade]}
                          </p>
                        </div>

                        <div className="">
                          <Chat />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          }
        })}
    </>
  );
}
