const Staff = require("../../Models/scheme/Staff_Expenses");

const CreateStaff = async (req, res, next) => {
  const { staffName, salary, phoneNumber, email } = req.body;

  try {
    // Cek apakah nomor telepon atau email sudah ada di database
    const existingStaff = await Staff.findOne({
      $or: [{ phone_number: phoneNumber }, { email: email }],
    });

    if (existingStaff) {
      return res.status(400).json({
        error: "Nomor telepon atau email sudah digunakan.",
      });
    }

    const createDataPassing = {
      staff_name: staffName,
      salary,
      phone_number: phoneNumber,
      email,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const createData = await Staff.create(createDataPassing);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create staff data",
        statusText: "Failed to create staff data",
        statusCode: 400,
      });
    } else {
      res.send({
        message: "Successfully created staff data",
        statusText: "Successfully created staff data",
        statusCode: 200,
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

const GetStaff = async (req, res, next) => {
  try {
    const getDataStaff = await Staff.find();

    res.send({
      message: "Successfully get staff data",
      statusText: "Successfully get staff data",
      statusCode: 200,
      data: getDataStaff,
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

const UpdateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { salary, phoneNumber, email } = req.body;

    // Cek apakah nomor telepon atau email sudah ada di database (kecuali untuk staf dengan id yang sedang diperbarui)
    const existingStaff = await Staff.findOne({
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

    const updateStaffData = {
      salary,
      phone_number: phoneNumber,
      email,
      updated_date: new Date(),
    };

    const updateStaffItem = await Staff.findByIdAndUpdate(id, updateStaffData, {
      new: true,
    });

    if (!updateStaffItem) {
      res.status(404).json({
        message: "Staff not found",
        statusText: "Staff not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfully updated staff data",
        statusText: "Successfully updated staff data",
        statusCode: 200,
        data: updateStaffItem,
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

const DeleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteStaffData = await Staff.findByIdAndDelete(id);

    if (!deleteStaffData) {
      res.status(404).json({
        message: "Staff not found",
        statusText: "Staff not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfully deleted staff data",
        statusText: "Successfully deleted staff data",
        statusCode: 200,
        data: deleteStaffData,
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
  CreateStaff,
  GetStaff,
  UpdateStaff,
  DeleteStaff,
};
