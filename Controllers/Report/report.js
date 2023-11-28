const ReportModels = require("../../Models/scheme/Report");

const totalSales = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          criteria: "pemasukan",
        },
      },
      {
        $group: {
          _id: { month: { $month: "$create_at" } },
          totalAmount: { $sum: "$total_amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalAmount: 1,
        },
      },
    ];

    const result = await ReportModels.aggregate(pipeline);
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalExpense = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          criteria: "pengeluaran",
        },
      },
      {
        $group: {
          _id: { month: { $month: "$create_at" } },
          totalAmount: { $sum: "$total_amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalAmount: 1,
        },
      },
    ];

    const result = await ReportModels.aggregate(pipeline);
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalExpenseByCriteria = async (req, res) => {
  try {
    const { criteria } = req.params;

    // Validasi parameter
    if (!criteria) {
      return res.status(400).json({ error: "Criteria is required." });
    }

    // Query database untuk mendapatkan total pengeluaran berdasarkan kriteria
    const totalExpense = await ReportModels.aggregate([
      {
        $match: { criteria: criteria },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]);

    // Respon dengan total pengeluaran
    res.json({
      totalExpense: totalExpense.length > 0 ? totalExpense[0].total : 0,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  totalSales,
  totalExpense,
  totalExpenseByCriteria,
};