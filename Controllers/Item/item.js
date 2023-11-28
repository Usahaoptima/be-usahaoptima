const ItemExpenses = require("../../Models/scheme/Item_Expenses");

const CreateItemExpenses = async (req, res, next) => {
  const { itemName, cost, quantity } = req.body;

  try {
    // Ambil total_cost dari semua data di database
    const totalCosts = await ItemExpenses.aggregate([
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

    const createData = await ItemExpenses.create(createDataPassing);

    if (!createData) {
      res.status(400).json({
        message: "Failed to create item expenses data",
        statusText: "Failed to create item expenses data",
        statusCode: 400,
      });
    } else {
      res.status(200).json({
        message: "Successfully created item expenses data",
        statusText: "Successfully created item expenses data",
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

const GetItemsExpenses = async (req, res, next) => {
  try {
    const getDataItems = await ItemExpenses.find();

    res.send({
      message: "Successfully fetched item expenses data",
      statusText: "Successfully fetched item expenses data",
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

const UpdateItemExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemName, cost, quantity } = req.body;

    const existingItem = await ItemExpenses.findById(id);

    const costDifference = cost - existingItem.cost;

    const newTotalCost = existingItem.total_cost + costDifference;

    const updateItemExpensesData = {
      item_name: itemName,
      cost: cost,
      quantity: quantity,
      total_cost: newTotalCost,
      updated_date: new Date().toISOString(),
    };

    const updateItemExpenses = await ItemExpenses.findByIdAndUpdate(
      id,
      updateItemExpensesData,
      {
        new: true,
      }
    );

    if (!updateItemExpenses) {
      res.status(404).json({
        message: "Item expenses not found",
        statusText: "Item expenses not found",
        statusCode: 404,
      });
    } else {
      res.status(200).json({
        message: "Successfully updated item data",
        statusText: "Successfully updated item data",
        statusCode: 200,
        data: updateItemExpenses,
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

const DeleteItemExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteItemExpensesData = await ItemExpenses.findByIdAndDelete(id);

    if (!deleteItemExpensesData) {
      res.status(404).json({
        message: "Item expenses not found",
        statusText: "Item expenses not found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfully deleted item expenses data",
        statusText: "Successfully deleted item expenses data",
        statusCode: 200,
        data: deleteItemExpensesData,
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
  CreateItemExpenses,
  GetItemsExpenses,
  UpdateItemExpenses,
  DeleteItemExpenses,
};
