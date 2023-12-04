const validateItemCreation = (req, res, next) => {
  const { itemName, cost, quantity } = req.body;

  // Validasi itemName
  if (!itemName || itemName.trim() === "") {
    return res.status(400).json({ error: "Nama item diperlukan." });
  }

  // Validasi cost
  if (!cost || isNaN(cost) || cost < 0) {
    return res
      .status(400)
      .json({ error: "Harga item harus berupa angka positif." });
  }

  // Validasi quantity
  if (!quantity || isNaN(quantity) || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Jumlah item harus berupa angka positif." });
  }

  next();
};

const validateItemUpdate = (req, res, next) => {
  const { cost, quantity } = req.body;

  // Validasi cost
  if (cost !== undefined && (isNaN(cost) || cost < 0)) {
    return res
      .status(400)
      .json({ error: "Harga item harus berupa angka positif." });
  }

  // Validasi quantity
  if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
    return res
      .status(400)
      .json({ error: "Jumlah item harus berupa angka positif." });
  }

  next();
};

module.exports = { validateItemCreation, validateItemUpdate };
