const ReportModels = require("../../Models/scheme/Report");

const totalSales = async (req, res, next) => {
  const token = req.tokenUser.data;
  try {
    const pipeline = [
      {
        $match: {
          criteria: "pemasukan",
          business_id: token.business_id,
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
  const token = req.tokenUser.data;
  try {
    const pipeline = [
      {
        $match: {
          criteria: "pengeluaran",
          business_id: token.business_id,
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
    const token = req.tokenUser.data;

    // Validasi parameter
    if (!criteria) {
      return res.status(400).json({ error: "Criteria is required." });
    }

    // Query database untuk mendapatkan total pengeluaran berdasarkan kriteria
    const totalExpense = await ReportModels.aggregate([
      {
        $match: { criteria: criteria, business_id: token.business_id },
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

const getAllDataGrouping = async (req, res) => {
  const token = req.tokenUser.data;
  try {
    // Query database untuk mendapatkan total nilai total_amount per bulan dan criteria
    const totalAmountPerMonth = await ReportModels.aggregate([
      {
        $match: { business_id: token.business_id },
      },
      {
        $group: {
          _id: {
            month: { $month: "$create_at" },
            criteria: "$criteria",
          },
          total: { $sum: "$total_amount" },
        },
      },
      {
        $sort: {
          "_id.month": 1, // Urutkan ascending berdasarkan bulan
          "_id.criteria": 1, // Jika ingin mengurutkan berdasarkan criteria juga
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          criteria: "$_id.criteria",
          total: 1,
        },
      },
    ]);

    // Respon dengan total nilai total_amount per bulan dan criteria
    res.json({ totalAmountPerMonth });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalMonthly = async (req, res) => {
  try {
    const { month } = req.params;
    const token = req.tokenUser.data;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month parameter." });
    }

    // Agregasi untuk mengubah format tanggal dan mendapatkan data berdasarkan bulan dan ID bisnis
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $month: "$create_at" }, parseInt(month)] } },
            { business_id: token.business_id },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          total_amount: 1,
          criteria: 1,
          create_at: {
            $dateToString: {
              format: "%Y-%m-%d", // Sesuaikan format tanggal yang diinginkan
              date: "$create_at",
              timezone: "Asia/Jakarta", // Sesuaikan dengan zona waktu yang sesuai
            },
          },
        },
      },
    ];

    // Eksekusi agregasi MongoDB
    const data = await ReportModels.aggregate(aggregationPipeline);

    // Respon dengan data yang ditemukan
    res.json({ data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalSalesMonthly = async (req, res) => {
  const token = req.tokenUser.data;
  const { month } = req.params;

  try {
    const matchStage = {
      $match: {
        criteria: "pemasukan",
        business_id: token.business_id,
        $expr: { $eq: [{ $month: "$create_at" }, parseInt(month)] },
      },
    };

    const groupStage = {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$create_at",
              timezone: "Asia/Jakarta",
            },
          },
        },
        totalAmount: { $sum: "$total_amount" },
      },
    };

    const sortStage = {
      $sort: {
        "_id.date": 1, // 1 untuk ascending, -1 untuk descending
      },
    };

    const projectStage = {
      $project: {
        _id: 0,
        date: "$_id.date",
        totalAmount: 1,
      },
    };

    const pipeline = [matchStage, groupStage, sortStage, projectStage];

    const result = await ReportModels.aggregate(pipeline);
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalExpenseMonthly = async (req, res) => {
  try {
    const matchStage = {
      $match: {
        criteria: "pengeluaran",
        business_id: token.business_id,
        $expr: { $eq: [{ $month: "$create_at" }, parseInt(month)] },
      },
    };

    const groupStage = {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$create_at",
              timezone: "Asia/Jakarta",
            },
          },
        },
        totalAmount: { $sum: "$total_amount" },
      },
    };

    const sortStage = {
      $sort: {
        "_id.date": 1, // 1 untuk ascending, -1 untuk descending
      },
    };

    const projectStage = {
      $project: {
        _id: 0,
        date: "$_id.date",
        totalAmount: 1,
      },
    };

    const pipeline = [matchStage, groupStage, sortStage, projectStage];

    const result = await ReportModels.aggregate(pipeline);
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalExpenseByCriteriaMonthly = async (req, res) => {
  try {
    const { criteria, month } = req.params;
    const token = req.tokenUser.data;

    // Validasi parameter
    if (!criteria && !month) {
      return res.status(400).json({ error: "Criteria is required." });
    }

    // Query database untuk mendapatkan total pengeluaran berdasarkan kriteria
    const totalExpense = await ReportModels.aggregate([
      {
        $match: {
          criteria: criteria,
          business_id: token.business_id,
          $expr: { $eq: [{ $month: "$create_at" }, parseInt(month)] },
        },
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
  getAllDataGrouping,
  //   get data by month
  totalMonthly,
  totalSalesMonthly,
  totalExpenseMonthly,
  totalExpenseByCriteriaMonthly,
};
