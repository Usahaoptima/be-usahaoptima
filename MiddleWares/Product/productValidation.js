const productValidation = (req, res, next) => {
  const { product_name, price, quantity } = req.body;

  if (!product_name || !price || !quantity) {
    res.status(400).send({
      messaage: "Field is not complete!",
      statusText: "Field is not complete!",
      statusCode: 400,
    });
  } else {
    next();
  }
};

module.exports = { productValidation };
