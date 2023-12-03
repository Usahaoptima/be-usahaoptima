const ReportModels = require("../../Models/scheme/Report");
const StaffExpenses = require("../../Models/scheme/Staff_Expenses");

const updateTotalCost = async () => {
  const totalCosts = await StaffExpenses.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$salary" },
      },
    },
  ]);

  const newTotalCost = totalCosts.length > 0 ? totalCosts[0].total : 0;

  await StaffExpenses.updateMany({}, { $set: { total_cost: newTotalCost } });
};

const createStaffExpenses = async (req, res, next) => {
  try {
    const { staffName, salary, phoneNumber, email } = req.body;

    const existingStaff = await StaffExpenses.findOne({
      $or: [{ phone_number: phoneNumber }, { email: email }],
    });

    if (existingStaff) {
      return res.status(400).json({
        error: "Nomor telepon atau email sudah digunakan.",
      });
    }

    const totalCosts = await StaffExpenses.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$salary" },
        },
      },
    ]);

    const newTotalCost =
      totalCosts.length > 0 ? totalCosts[0].total + salary : salary;

    const createDataPassing = {
      staff_name: staffName,
      salary,
      phone_number: phoneNumber,
      email,
      total_cost: newTotalCost,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const createData = await StaffExpenses.create(createDataPassing);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create staff expenses data",
        statusText: "Failed to create staff expenses data",
        statusCode: 400,
      });
    } else {
      await updateTotalCost();

      res.status(200).json({
        message: "Successfully created staff expenses data",
        statusText: "Successfully created staff expenses data",
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

const getStaffExpenses = async (req, res, next) => {
  try {
    const getDataStaffExpenses = await StaffExpenses.find();

    if (getDataStaffExpenses.length === 0) {
      return res.status(404).json({
        message: "No staff expenses data found",
        statusText: "No staff expenses data found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      message: "Successfully fetched staff expenses data",
      statusText: "Successfully fetched staff expenses data",
      statusCode: 200,
      data: getDataStaffExpenses,
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

const updateStaffExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { salary, phoneNumber, email } = req.body;

    const existingStaff = await StaffExpenses.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ phone_number: phoneNumber }, { email: email }] },
      ],
    });

    if (existingStaff) {
      return res.status(400).json({
        error: "Nomor telepon atau email sudah digunakan.",
      });
    }

    const existingStaffExpenses = await StaffExpenses.findById(id);

    const salaryDifference = salary - existingStaffExpenses.salary;

    const newTotalCost = existingStaffExpenses.total_cost + salaryDifference;

    const updateStaffExpensesData = {
      salary,
      phone_number: phoneNumber,
      email,
      total_cost: newTotalCost,
      updated_date: new Date(),
    };

    const updateStaffExpensesItem = await StaffExpenses.findByIdAndUpdate(
      id,
      updateStaffExpensesData,
      { new: true }
    );

    if (!updateStaffExpensesItem) {
      res.status(404).json({
        message: "Staff expenses not found",
        statusText: "Staff expenses not found",
        statusCode: 404,
      });
    } else {
      await updateTotalCost();

      res.status(200).json({
        message: "Successfully updated staff expenses data",
        statusText: "Successfully updated staff expenses data",
        statusCode: 200,
        data: updateStaffExpensesItem,
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

const deleteStaffExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteStaffExpensesData = await StaffExpenses.findByIdAndDelete(id);

    if (!deleteStaffExpensesData) {
      res.status(404).json({
        message: "Staff expenses not found",
        statusText: "Staff expenses not found",
        statusCode: 404,
      });
    } else {
      await updateTotalCost();

      res.status(200).json({
        message: "Successfully deleted staff expenses data",
        statusText: "Successfully deleted staff expenses data",
        statusCode: 200,
        data: deleteStaffExpensesData,
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

const deleteAllStaffExpenses = async (req, res, next) => {
  try {
    // Hapus semua data pengeluaran staf
    const deleteAllData = await StaffExpenses.deleteMany({});

    // Set total_cost ke 0 di semua data
    await StaffExpenses.updateMany({}, { $set: { total_cost: 0 } });

    res.status(200).json({
      message: "Berhasil menghapus semua data pengeluaran staf",
      statusText: "Berhasil menghapus semua data pengeluaran staf",
      statusCode: 200,
      data: { deletedCount: deleteAllData.deletedCount },
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

module.exports = {
  createStaffExpenses,
  getStaffExpenses,
  updateStaffExpenses,
  deleteStaffExpenses,
  deleteAllStaffExpenses,
};
