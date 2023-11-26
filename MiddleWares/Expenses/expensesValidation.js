const validateExpensesCreation = (req, res, next) => {
  const { expenseName, totalCost } = req.body;

  // Validasi expenseName
  if (!expenseName || expenseName.trim() === "") {
    return res.status(400).json({ error: "Nama pengeluaran diperlukan." });
  }

  // Validasi totalCost
  if (!totalCost || isNaN(totalCost) || totalCost < 0) {
    return res
      .status(400)
      .json({ error: "Total biaya harus berupa angka positif." });
  }

  next();
};

const validateExpensesUpdate = (req, res, next) => {
  const { totalCost } = req.body;

  // Validasi totalCost
  if (totalCost !== undefined && (isNaN(totalCost) || totalCost < 0)) {
    return res
      .status(400)
      .json({ error: "Total biaya harus berupa angka positif." });
  }

  next();
};

module.exports = { validateExpensesCreation, validateExpensesUpdate };
