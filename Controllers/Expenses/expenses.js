const ReportModels = require("../../Models/scheme/Report");
const Expenses = require("../../Models/scheme/Shop_Expenses");

const createExpenses = async (req, res, next) => {
  const { expense_name, cost } = req.body;
  const token = req.tokenUser.data;

  try {
    const createDataPassing = {
      expense_name: expense_name,
      cost: cost,
      created_date: new Date(),
      updated_date: new Date().toISOString(),
      business_id: token.business_id,
    };

    const createData = await Expenses.create(createDataPassing);

    if (!createData) {
      res.status(400).json({
        message: "Gagal membuat data pengeluaran",
        statusText: "Gagal membuat data pengeluaran",
        statusCode: 400,
      });
    } else {
      const dataReport = {
        total_amount: cost,
        criteria: "pengeluaran",
        create_at: new Date(),
        report_id: createData._id,
        business_id: token.business_id,
      };

      await ReportModels.create(dataReport);

      res.status(200).json({
        message: "Berhasil membuat data pengeluaran",
        statusText: "Berhasil membuat data pengeluaran",
        statusCode: 200,
        data: createData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      statusText: "Internal server error",
      statusCode: 500,
    });
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const token = req.tokenUser.data;
    const getDataExpenses = await Expenses.find({
      business_id: token.business_id,
    });

    res.status(200).json({
      message: "Berhasil mengambil data pengeluaran",
      statusText: "Berhasil mengambil data pengeluaran",
      statusCode: 200,
      data: getDataExpenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      statusText: "Internal server error",
      statusCode: 500,
    });
  }
};

const updateExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expense_name, cost } = req.body;

    const existingExpenses = await Expenses.findById(id);

    if (!existingExpenses) {
      res.status(404).json({
        message: "Data pengeluaran tidak ditemukan",
        statusText: "Data pengeluaran tidak ditemukan",
        statusCode: 404,
      });
    }

    const updateExpensesData = {
      expense_name: expense_name,
      cost: cost,
      updated_date: new Date().toISOString(),
    };

    const updateExpensesItem = await Expenses.findByIdAndUpdate(
      id,
      updateExpensesData,
      { new: true }
    );

    if (!updateExpensesItem) {
      res.status(404).json({
        message: "Data pengeluaran tidak ditemukan",
        statusText: "Data pengeluaran tidak ditemukan",
        statusCode: 404,
      });
    } else {
      const reportUpdateData = {
        total_amount: cost,
      };

      await ReportModels.findOneAndUpdate(
        { report_id: updateExpensesItem._id },
        reportUpdateData,
        { new: true }
      );

      res.status(200).json({
        message: "Berhasil memperbarui data pengeluaran",
        statusText: "Berhasil memperbarui data pengeluaran",
        statusCode: 200,
        data: updateExpensesItem,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      statusText: "Internal server error",
      statusCode: 500,
    });
  }
};

const deleteExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteExpensesData = await Expenses.findByIdAndDelete(id);

    if (!deleteExpensesData) {
      res.status(404).json({
        message: "Data pengeluaran tidak ditemukan",
        statusText: "Data pengeluaran tidak ditemukan",
        statusCode: 404,
      });
    } else {
      await ReportModels.findOneAndDelete({
        report_id: deleteExpensesData._id,
      });

      res.status(200).json({
        message: "Berhasil menghapus data pengeluaran",
        statusText: "Berhasil menghapus data pengeluaran",
        statusCode: 200,
        data: { deletedId: deleteExpensesData._id },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      statusText: "Internal server error",
      statusCode: 500,
    });
  }
};

const TotalCost = async (req, res, next) => {
  const token = req.tokenUser.data;
  try {
    const totalCost = await Expenses.aggregate([
      {
        $match: { business_id: token.business_id },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$cost" },
        },
      },
    ]);

    // Respon dengan total pengeluaran
    res.send({
      data: {
        totalCost: totalCost.length > 0 ? totalCost[0].total : 0,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createExpenses,
  getExpenses,
  updateExpenses,
  deleteExpenses,
  TotalCost,
};
