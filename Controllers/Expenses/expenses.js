const ReportModels = require("../../Models/scheme/Report");
const Expenses = require("../../Models/scheme/Shop_Expenses");

const createExpenses = async (req, res, next) => {
  const { expenseName, cost } = req.body;

  try {
    // Ambil total_cost dari semua data di database
    const totalCosts = await Expenses.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$cost" },
        },
      },
    ]);

    // Set total_cost ke total biaya yang dihitung atau 0 jika tidak ada data
    const newTotalCost =
      totalCosts.length > 0 ? totalCosts[0].total + cost : cost;

    const createDataPassing = {
      expense_name: expenseName,
      cost: cost,
      total_cost: newTotalCost,
      created_date: new Date(),
      updated_date: new Date().toISOString(),
    };

    const createData = await Expenses.create(createDataPassing);
    const dataReport = {
      total_amount: createData.total_cost,
      criteria: "pengeluaran",
      create_at: new Date(),
      report_id: createData._id,
    };

    const createReport = await ReportModels.create(dataReport);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create expenses data",
        statusText: "Failed to create expenses data",
        statusCode: 400,
      });
    } else {
      res.status(200).json({
        message: "Successfully created expenses data",
        statusText: "Successfully created expenses data",
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
    const getDataExpenses = await Expenses.find();

    res.status(200).json({
      message: "Successfully fetched expenses data",
      statusText: "Successfully fetched expenses data",
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
    const { expenseName, cost } = req.body;

    const existingExpenses = await Expenses.findById(id);

    const costDifference = cost - existingExpenses.cost;

    const newTotalCost = existingExpenses.total_cost + costDifference;

    const updateExpensesData = {
      expense_name: expenseName,
      cost: cost,
      total_cost: newTotalCost,
      updated_date: new Date().toISOString(),
    };

    const updateExpensesItem = await Expenses.findByIdAndUpdate(
      id,
      updateExpensesData,
      { new: true }
    );

    if (!updateExpensesItem) {
      res.status(404).json({
        message: "Expenses not found",
        statusText: "Expenses not found",
        statusCode: 404,
      });
    } else {
      res.status(200).json({
        message: "Successfully updated expenses data",
        statusText: "Successfully updated expenses data",
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
        message: "Expenses not found",
        statusText: "Expenses not found",
        statusCode: 404,
      });
    } else {
      res.status(200).json({
        message: "Successfully deleted expenses data",
        statusText: "Successfully deleted expenses data",
        statusCode: 200,
        data: deleteExpensesData,
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

module.exports = {
  createExpenses,
  getExpenses,
  updateExpenses,
  deleteExpenses,
};
