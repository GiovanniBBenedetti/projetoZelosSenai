import {listarPatrimoniosDashboard, listarTodosUsuariosDashboard,listarChamadosAtrasados } from "../models/Dashboard.js"

const listarPatrimonioDashboardController = async (req, res) => {
    try {
        const {status} = req.query
        let patrimonios;
        if(status){
            patrimonios = await listarPatrimoniosDashboard(status)
        }else{
            patrimonios = await listarPatrimoniosDashboard()
        }
        res.status(200).json(patrimonios)
    } catch (err) {
        console.error('Erro ao listar Patrimônios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar Patrimônios' })
    }
}



const listarUsuariosDashboardController = async (req, res) => {
    try {
        const { status } = req.query;

        let usuarios;
        if (status) {
            usuarios = await listarTodosUsuariosDashboard(status);
        } else {
            usuarios = await listarTodosUsuariosDashboard();
        }
     
        res.status(200).json(usuarios)
    } catch (err) {
        console.error('Erro ao listar usuarios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar usuarios' })
    }
}



const listarChamadosAtrasadosController = async (req, res) => {
    try {
        const chamados = await listarChamadosAtrasados();
        res.status(200).json(chamados);
    } catch (err) {
        console.error("Erro ao listar chamados atrasados:", err);
        res.status(500).json({ mensagem: "Erro ao listar chamados atrasados" });
    }
};



export {
    listarPatrimonioDashboardController,listarUsuariosDashboardController, listarChamadosAtrasadosController
    };