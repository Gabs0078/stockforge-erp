export function crudController(Model, include = []) {
  return {
    async list(req, res) {
      const items = await Model.findAll({ include, order: [['id', 'DESC']] });
      res.json(items);
    },
    async get(req, res) {
      const item = await Model.findByPk(req.params.id, { include });
      if (!item) return res.status(404).json({ message: 'Registro não encontrado' });
      res.json(item);
    },
    async create(req, res) {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(409).json({ message: 'Registro duplicado', details: error.errors?.map(e => e.message) });
        }
        throw error;
      }
    },
    async update(req, res) {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Registro não encontrado' });
      try {
        await item.update(req.body);
        res.json(item);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(409).json({ message: 'Registro duplicado', details: error.errors?.map(e => e.message) });
        }
        throw error;
      }
    },
    async remove(req, res) {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Registro não encontrado' });
      try {
        await item.destroy();
        res.status(204).send();
      } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
          return res.status(409).json({ message: 'Não é possível excluir: registro está em uso.' });
        }
        throw error;
      }
    }
  };
}
