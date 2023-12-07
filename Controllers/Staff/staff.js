const ReportModels = require("../../Models/scheme/Report");
const StaffExpenses = require("../../Models/scheme/Staff_Expenses");

const createStaffExpenses = async (req, res, next) => {
  try {
    const { staff_name, salary, phone_number, email } = req.body;
    const token = req.tokenUser.data;
    const existingStaff = await StaffExpenses.findOne({
      $or: [{ phone_number: phone_number }, { email: email }],
    });

    if (existingStaff) {
      return res.status(400).json({
        error: "Nomor telepon atau email sudah digunakan.",
      });
    }

    const createDataPassing = {
      staff_name: staff_name,
      salary: salary,
      phone_number: phone_number,
      email: email,
      created_date: new Date(),
      updated_date: new Date(),
      business_id: token.business_id,
    };

    const createData = await StaffExpenses.create(createDataPassing);

    const dataReport = {
      total_amount: salary,
      criteria: "pengeluaran",
      create_at: new Date(),
      report_id: createData._id,
      business_id: token.business_id,
    };

    await ReportModels.create(dataReport);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create staff expenses data",
        statusText: "Failed to create staff expenses data",
        statusCode: 400,
      });
    } else {
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
    const token = req.tokenUser.data;
    const getDataStaffExpenses = await StaffExpenses.find({
      business_id: token.business_id,
    });

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
    const { salary, phone_number, email } = req.body;

    const existingStaff = await StaffExpenses.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ phone_number: phone_number }, { email: email }] },
      ],
    });

    if (existingStaff) {
      return res.status(400).json({
        error: "Nomor telepon atau email sudah digunakan.",
      });
    }

    const existingStaffExpenses = await StaffExpenses.findById(id);

    if (!existingStaffExpenses) {
      return res.status(404).json({
        message: "Staff expenses not found",
        statusText: "Staff expenses not found",
        statusCode: 404,
      });
    }

    const updateStaffExpensesData = {
      salary: salary,
      phone_number: phone_number,
      email: email,
      updated_date: new Date(),
    };

    const updateStaffExpensesItem = await StaffExpenses.findByIdAndUpdate(
      id,
      updateStaffExpensesData,
      { new: true }
    );

    const reportUpdateData = {
      total_amount: salary,
    };

    await ReportModels.findOneAndUpdate({ report_id: id }, reportUpdateData, {
      new: true,
    });

    if (!updateStaffExpensesItem && !reportUpdateData) {
      res.status(404).json({
        message: "Staff expenses not found",
        statusText: "Staff expenses not found",
        statusCode: 404,
      });
    } else {
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
    const deleteReportData = await ReportModels.findOneAndDelete({
      report_id: id,
    });

    if (!deleteStaffExpensesData && !deleteReportData) {
      res.status(404).json({
        message: "Staff expenses not found",
        statusText: "Staff expenses not found",
        statusCode: 404,
      });
    } else {
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

const TotalCost = async (req, res, next) => {
  const token = req.tokenUser.data;
  try {
    const totalCost = await StaffExpenses.aggregate([
      {
        $match: { business_id: token.business_id },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$salary" },
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
  createStaffExpenses,
  getStaffExpenses,
  updateStaffExpenses,
  deleteStaffExpenses,
  TotalCost,
};
