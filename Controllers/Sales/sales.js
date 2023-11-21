const SalesModels = require("../../Models/scheme/Sales");
const CreateSales = async (req, res, next) => {
  const { sales_name, product_id, quantity, total_price } = req.body;

  try {
    let createDataPassing = {
      sales_name: sales_name,
      product_id: product_id,
      quantity: quantity,
      total_price: total_price,
      created_date: new Date(),
      updated_date: new Date(),
    };

    let createData = await SalesModels.create(createDataPassing);

    if (!createData) {
      res.status(400);
    } else {
      res.send({
        message: "Successfull to create data sales",
        statusText: "Successfull to create data sales",
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

const GetSales = async (req, res, next) => {
  try {
    let getDataSales = await SalesModels.find();

    res.send({
      message: "Successfull to create data sales",
      statusText: "Successfull to create data sales",
      statusCode: 200,
      data: getDataSales,
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

const UpdateSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sales_name } = req.body;
    const { product_id } = req.body;
    const { quantity } = req.body;
    const { total_price } = req.body;

    const updateSalesData = {
      sales_name: sales_name,
      product_id: product_id,
      quantity: quantity,
      total_price: total_price,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const updateSales = await SalesModels.findByIdAndUpdate(
      id,
      updateSalesData,
      { new: true }
    );

    if (!updateSales) {
      res.status(404).json({
        message: "Sales not found",
        statusText: "Sales not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfull to update data sales",
        statusText: "Successfull to update data sales",
        statusCode: 200,
        data: updateSales,
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

const DeleteSales = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteSalesData = await SalesModels.findByIdAndDelete(id);

    if (!deleteSalesData) {
      res.status(404).json({
        message: "Sales not found",
        statusText: "Sales not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfull to delete data sales",
        statusText: "Successfull to delete data sales",
        statusCode: 200,
        data: deleteSalesData,
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
  CreateSales,
  GetSales,
  UpdateSales,
  DeleteSales,
};
