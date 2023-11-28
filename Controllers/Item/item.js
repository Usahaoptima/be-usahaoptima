const Item = require("../../Models/scheme/Item_Expenses");

const CreateItem = async (req, res, next) => {
  const { itemName, cost, quantity } = req.body;

  try {
    // Ambil total_cost dari semua data di database
    const totalCosts = await Item.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_cost" },
        },
      },
    ]);

    // Set total_cost ke total biaya yang dihitung atau 0 jika tidak ada data
    const newTotalCost =
      totalCosts.length > 0 ? totalCosts[0].total + cost : cost;

    const createDataPassing = {
      item_name: itemName,
      cost: cost,
      quantity: quantity,
      total_cost: newTotalCost,
      created_date: new Date(),
      updated_date: new Date().toISOString(),
    };

    const createData = await Item.create(createDataPassing);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create item data",
        statusText: "Failed to create item data",
        statusCode: 400,
      });
    } else {
      res.status(200).json({
        message: "Successfully created item data",
        statusText: "Successfully created item data",
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
    const { itemName, cost, quantity } = req.body;

    const existingItem = await Item.findById(id);

    const costDifference = cost - existingItem.cost;

    const newTotalCost = existingItem.total_cost + costDifference;

    const updateItemData = {
      item_name: itemName,
      cost: cost,
      quantity: quantity,
      total_cost: newTotalCost,
      updated_date: new Date().toISOString(),
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
      res.status(200).json({
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

const calculateTotalCost = async () => {
  const totalCosts = await Item.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$cost" },
      },
    },
  ]);

  return totalCosts.length > 0 ? totalCosts[0].total : 0;
};

module.exports = {
  CreateItem,
  GetItems,
  UpdateItem,
  DeleteItem,
};
