const SalesModels = require("../../Models/scheme/Sales");
const Product = require("../../Models/scheme/Product");
const ReportModels = require("../../Models/scheme/Report");

const CreateSales = async (req, res, next) => {
  const { sales_name, product_name, quantity, total_price } = req.body;

  try {
    // Cari ID produk berdasarkan nama produk
    const product = await Product.findOne({ product_name: product_name });

    if (!product) {
      return res.status(400).json({
        message: "Product not found",
        statusText: "Product not found",
        statusCode: 400,
      });
    }

    const createDataPassing = {
      sales_name: sales_name,
      product_name: product_name,
      quantity: quantity,
      total_price: total_price,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const createData = await SalesModels.create(createDataPassing);

    const dataToReport = {
      total_amount: createData.total_price,
      criteria: "pemasukan",
      create_at: new Date(),
      report_id: createData._id,
    };

    const createReport = await ReportModels.create(dataToReport);

    if (!createData && !createReport) {
      res.status(400);
    } else {
      res.json({
        message: "Successfull to create data sales",
        statusText: "Successfull to create data sales",
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

const GetSales = async (req, res, next) => {
  try {
    let getDataSales = await SalesModels.find();

    res.send({
      message: "Successfull to get data sales",
      statusText: "Successfull to get data sales",
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
    const { product_name } = req.body;
    const { quantity } = req.body;
    const { total_price } = req.body;

    const updateSalesData = {
      sales_name: sales_name,
      product_name: product_name,
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
