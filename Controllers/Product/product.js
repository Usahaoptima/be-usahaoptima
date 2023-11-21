const ProductModels = require("../../Models/scheme/Product");

const CreateProduct = async (req, res, next) => {
  const { product_name, price, quantity } = req.body;

  try {
    let createDataPassing = {
      product_name: product_name,
      price: price,
      quantity: quantity,
      created_date: new Date(),
      updated_date: new Date(),
    };

    let createData = await ProductModels.create(createDataPassing);

    if (!createData) {
      res.status(400);
    } else {
      res.send({
        message: "Successfull to create data product",
        statusText: "Successfull to create data product",
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

const GetProduct = async (req, res, next) => {
  let getDataProduct = await ProductModels.find();

  try {
    res.send({
      message: "Successfull to create data product",
      statusText: "Successfull to create data product",
      statusCode: 200,
      data: getDataProduct,
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

const UpdateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product_name } = req.body;
    const { price } = req.body;
    const { quantity } = req.body;

    const updateProductData = {
      product_name: product_name,
      price: price,
      quantity: quantity,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const updateProductItem = await ProductModels.findByIdAndUpdate(
      id,
      updateProductData,
      { new: true }
    );

    if (!updateProductItem) {
      res.status(404).json({
        message: "Product not found",
        statusText: "Product not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfull to update data product",
        statusText: "Successfull to update data product",
        statusCode: 200,
        data: updateProductItem,
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

const DeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteProductData = await ProductModels.findByIdAndDelete(id);

    if (!deleteProductData) {
      res.status(404).json({
        message: "Product not found",
        statusText: "Product not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfull to delete data product",
        statusText: "Successfull to delete data product",
        statusCode: 200,
        data: deleteProductData,
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
  CreateProduct,
  GetProduct,
  UpdateProduct,
  DeleteProduct,
};
