const ItemExpenses = require("../../Models/scheme/Item_Expenses");
const ReportModels = require("../../Models/scheme/Report");

const updateTotalCost = async () => {
  const totalCosts = await ItemExpenses.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$cost" },
      },
    },
  ]);

  const newTotalCost = totalCosts.length > 0 ? totalCosts[0].total : 0;

  await ItemExpenses.updateMany({}, { $set: { total_cost: newTotalCost } });
};

const CreateItemExpenses = async (req, res, next) => {
  const { itemName, cost, quantity } = req.body;
  const token = req.tokenUser.data;

  try {
    const existingItem = await ItemExpenses.findOne({ item_name: itemName });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      const updateItemData = {
        cost: existingItem.cost + cost,
        quantity: newQuantity,
        total_cost: existingItem.total_cost + cost,
        updated_date: new Date().toISOString(),
      };

      const updatedItem = await ItemExpenses.findByIdAndUpdate(
        existingItem._id,
        updateItemData,
        { new: true }
      );

      // Update total_cost di semua data
      await updateTotalCost();

      res.status(200).json({
        message: "Berhasil mengupdate data item",
        statusText: "Berhasil mengupdate data item",
        statusCode: 200,
        data: updatedItem,
      });
    } else {
      const totalCosts = await ItemExpenses.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$cost" },
          },
        },
      ]);

      const newTotalCost =
        totalCosts.length > 0 ? totalCosts[0].total + cost : cost;

      const createDataPassing = {
        item_name: itemName,
        cost: cost,
        quantity: quantity,
        total_cost: newTotalCost,
        created_date: new Date(),
        updated_date: new Date().toISOString(),
        business_id: token.business_id,
      };

      const createData = await ItemExpenses.create(createDataPassing);

      const dataReport = {
        total_amount: cost,
        criteria: "pengeluaran",
        create_at: new Date(),
        report_id: createData._id,
        business_id: token.business_id,
      };

      await ReportModels.create(dataReport);

      if (!createData) {
        res.status(400).json({
          message: "Gagal membuat data item expenses",
          statusText: "Gagal membuat data item expenses",
          statusCode: 400,
        });
      } else {
        // Update total_cost di semua data
        await updateTotalCost();

        res.status(200).json({
          message: "Berhasil membuat data item expenses",
          statusText: "Berhasil membuat data item expenses",
          statusCode: 200,
          data: createData,
        });
      }
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
    const token = req.tokenUser.data;
    const getDataItems = await ItemExpenses.find({
      business_id: token.business_id,
    });

    if (getDataItems.length === 0) {
      res.status(404).json({
        message: "No item expenses data found",
        statusText: "No item expenses data found",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Successfully fetched item expenses data",
        statusText: "Successfully fetched item expenses data",
        statusCode: 200,
        data: getDataItems,
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

    const updateItem = await ItemExpenses.findByIdAndUpdate(
      id,
      updateItemExpensesData,
      { new: true }
    );

    // Update total_cost di semua data
    await updateTotalCost();

    const reportUpdateData = {
      total_amount: cost,
    };

    await ReportModels.findOneAndUpdate({ report_id: id }, reportUpdateData, {
      new: true,
    });

    res.status(200).json({
      message: "Successfully updated item data",
      statusText: "Successfully updated item data",
      statusCode: 200,
      data: updateItem,
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

const DeleteItemExpenses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteItemData = await ItemExpenses.findByIdAndDelete(id);
    const deleteReportData = await ReportModels.findOneAndDelete({
      report_id: id,
    });

    if (!deleteItemData && !deleteReportData) {
      res.status(404).json({
        message: "Item expenses not found",
        statusText: "Item expenses not found",
        statusCode: 404,
      });
    } else {
      // Update total_cost di semua data
      await updateTotalCost();

      res.send({
        message: "Successfully deleted item expenses data",
        statusText: "Successfully deleted item expenses data",
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

const DeleteAllItemsExpenses = async (req, res, next) => {
  try {
    // Hapus semua data item expenses
    const deleteAllData = await ItemExpenses.deleteMany({});

    // Update total_cost di semua data
    await updateTotalCost();

    res.status(200).json({
      message: "Berhasil menghapus semua data item expenses",
      statusText: "Berhasil menghapus semua data item expenses",
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
  CreateItemExpenses,
  GetItemsExpenses,
  UpdateItemExpenses,
  DeleteItemExpenses,
  DeleteAllItemsExpenses,
};
