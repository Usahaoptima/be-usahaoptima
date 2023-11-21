const salesValidation = (req, res, next) => {
  const { sales_name, product_id, quantity, total_price } = req.body;

  if (!sales_name || !product_id || !quantity || !total_price) {
    res.status(400).send({
      message: "Field is not complete!",
      statusText: "Field is not complete!",
      statusCode: 400,
    });
  } else {
    next();
  }
};

module.exports = { salesValidation };
