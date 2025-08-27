import { listarPools, listarPoolsporId } from "../models/Pool.js";

const listarPoolsController = async (req, res) => {
  try {
    const pools = await listarPools();
    res.status(200).json(pools);
  } catch (error) {
    console.error('Erro ao listar pools:', error);
    res.status(500).json({ message: 'Erro ao listar pools' });
  }
}

const listarPoolporIdController = async (req, res) => {
  const poolId = req.params.id;
  try {
    const pool = await listarPoolsporId(poolId);
    if (!pool) {
      return res.status(404).json({ message: 'Pool não encontrado' });
    }
    res.status(200).json(pool);
  } catch (error) {
    console.error('Erro ao listar pool por ID:', error);
    res.status(500).json({ message: 'Erro ao listar pool por ID' });
  }
}

export { listarPoolsController, listarPoolporIdController };