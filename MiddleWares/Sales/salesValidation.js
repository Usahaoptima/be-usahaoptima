const salesValidation = (req, res, next) => {
  const { sales_name, product_name, quantity } = req.body;

  if (!sales_name || !product_name || !quantity) {
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
