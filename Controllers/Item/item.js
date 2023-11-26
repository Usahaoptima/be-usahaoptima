const Item = require("../../Models/scheme/Item");

const CreateItem = async (req, res, next) => {
  const { itemName, totalCost, quantity } = req.body;

  try {
    const createDataPassing = {
      item_name: itemName,
      total_cost: totalCost,
      quantity: quantity,
      created_date: new Date(),
      updated_date: new Date(),
    };

    const createData = await Item.create(createDataPassing);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create item data",
        statusText: "Failed to create item data",
        statusCode: 400,
      });
    } else {
      res.send({
        message: "Successfully created item data",
        statusText: "Successfully created item data",
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

const GetItems = async (req, res, next) => {
  try {
    const getDataItems = await Item.find();

    res.send({
      message: "Successfully fetched item data",
      statusText: "Successfully fetched item data",
      statusCode: 200,
      data: getDataItems,
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

const UpdateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemName, totalCost, quantity } = req.body;

    const updateItemData = {
      item_name: itemName,
      total_cost: totalCost,
      quantity: quantity,
      updated_date: new Date(),
    };

    const updateItem = await Item.findByIdAndUpdate(id, updateItemData, {
      new: true,
    });

    if (!updateItem) {
      res.status(404).json({
        message: "Item not found",
        statusText: "Item not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfully updated item data",
        statusText: "Successfully updated item data",
        statusCode: 200,
        data: updateItem,
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

const DeleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteItemData = await Item.findByIdAndDelete(id);

    if (!deleteItemData) {
      res.status(404).json({
        message: "Item not found",
        statusText: "Item not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfully deleted item data",
        statusText: "Successfully deleted item data",
        statusCode: 200,
        data: deleteItemData,
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
  CreateItem,
  GetItems,
  UpdateItem,
  DeleteItem,
};
