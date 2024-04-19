const SalesModels = require('../../Models/scheme/Sales');
const Product = require('../../Models/scheme/Product');
const ReportModels = require('../../Models/scheme/Report');
const Midtrans = require('midtrans-client');

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SERVERKEY,
  clientKey: process.env.CLIENTKEY,
});
const CreateSales = async (req, res, next) => {
  const { sales_name, product_name, quantity, total_price } = req.body;
  const token = req.tokenUser.data;
  try {
    const product = await Product.findOne({ product_name: product_name });
    if (!product) {
      return res.status(202).json({
        message: 'Product not found',
        statusText: 'Product not found',
        statusCode: 202,
      });
    }

    if (product.quantity < quantity) {
      return res.status(202).json({
        message: 'Stock Tidak Mencukupi',
        statusText: 'Stock Tidak Mencukupi',
        statusCode: 202,
      });
    }
    const createDataPassing = {
      sales_name: sales_name,
      product_name: product_name,
      quantity: quantity,
      total_price: total_price,
      business_id: token.business_id,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const createData = await SalesModels.create(createDataPassing);

    const dataReport = {
      total_amount: createData.total_price,
      criteria: 'pemasukan',
      create_at: new Date(),
      report_id: createData._id,
      business_id: token.business_id,
    };

    const createReport = await ReportModels.create(dataReport);

    if (!createData && !createReport) {
      res.status(400);
    } else {
      res.json({
        message: 'Successfull to create data sales',
        statusText: 'Successfull to create data sales',
        statusCode: 200,
        data: createData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      statusText: 'Internal server error',
      statusCode: 500,
    });
  }
};

const Payment = async (req, res, next) => {
  const { product_name, quantity, total_price } = req.body;
  const token = req.tokenUser.data;
  try {
    const product = await Product.findOne({ product_name: product_name });

    if (!product) {
      return res.status(202).json({
        statusCode: 202,
        message: 'Product not found',
        statusText: 'Product not found',
      });
    }

    if (product.quantity < quantity) {
      return res.status(202).json({
        statusCode: 202,
        message: 'Stock Tidak Mencukupi',
        statusText: 'Stock Tidak Mencukupi',
      });
    }

    const midtransData = {
      item_details: {
        name: product_name,
        quantity: quantity,
        price: product.price,
      },
      transaction_details: {
        order_id: Math.random() * 1000 + 1,
        gross_amount: quantity * product.price,
      },
    };

    const transaction = await snap.createTransactionToken(midtransData);
    if (!transaction) {
      return res.status(202).json({
        statusCode: 202,
        message: 'Failed to create transaction token',
        statusText: 'Failed to create transaction token',
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: 'Successfull to create payment token',
        statusText: 'Successfull to create payment token',
        transactionToken: transaction,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      statusText: 'Internal server error',
      statusCode: 500,
    });
  }
};

const GetSales = async (req, res, next) => {
  const token = req.tokenUser.data;
  try {
    const getDataSales = await SalesModels.find({
      business_id: token.business_id,
    });
    res.send({
      message: 'Successfull to get data sales',
      statusText: 'Successfull to get data sales',
      statusCode: 200,
      data: getDataSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      statusText: 'Internal server error',
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

    const updatedReportData = {
      total_amount: updateSales.total_price,
    };

    const updateReport = await ReportModels.findOneAndUpdate(
      { report_id: updateSales._id },
      updatedReportData,
      { new: true }
    );

    if (!updateSales && !updateReport) {
      res.status(404).json({
        message: 'Sales not found',
        statusText: 'Sales not found',
        statusCode: 404,
      });
    } else {
      res.send({
        message: 'Successfull to update data sales',
        statusText: 'Successfull to update data sales',
        statusCode: 200,
        data: updateSales,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      statusText: 'Internal server error',
      statusCode: 500,
    });
  }
};

const DeleteSales = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteSalesData = await SalesModels.findByIdAndDelete(id);
    const deleteReportData = await ReportModels.findOneAndDelete({
      report_id: id,
    });
    if (!deleteSalesData && !deleteReportData) {
      res.status(404).json({
        message: 'Sales not found',
        statusText: 'Sales not found',
        statusCode: 404,
      });
    } else {
      res.send({
        message: 'Successfull to delete data sales',
        statusText: 'Successfull to delete data sales',
        statusCode: 200,
        data: deleteSalesData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      statusText: 'Internal server error',
      statusCode: 500,
    });
  }
};

module.exports = {
  CreateSales,
  GetSales,
  UpdateSales,
  DeleteSales,
  Payment,
};
