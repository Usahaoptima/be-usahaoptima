const validateExpensesCreation = (req, res, next) => {
  const { expenseName, cost } = req.body;

  // Validasi expenseName
  if (!expenseName || expenseName.trim() === "") {
    return res.status(400).json({ error: "Nama pengeluaran diperlukan." });
  }

  // Validasi cost
  if (!cost || isNaN(cost) || cost < 0) {
    return res
      .status(400)
      .json({ error: "Total biaya harus berupa angka positif." });
  }

  next();
};

const validateExpensesUpdate = (req, res, next) => {
  const { cost } = req.body;

  // Validasi cost
  if (cost !== undefined && (isNaN(cost) || cost < 0)) {
    return res
      .status(400)
      .json({ error: "Total biaya harus berupa angka positif." });
  }

  next();
};

module.exports = { validateExpensesCreation, validateExpensesUpdate };
