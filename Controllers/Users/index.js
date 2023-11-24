const UserModels = require("../../Models/scheme/User");

const getUsers = async (req, res) => {
  const token = req.tokenUser.data;
  const users = await UserModels.find({ business_id: token.business_id });

  if (!users) {
    res.status(401).send({
      message: "belum ada data",
      statusText: "belum ada data",
      statusCode: 401,
    });
  }

  res.status(200).send({
    message: "berhasil mendapatkan data",
    statusText: "berhasil mendapatkan data",
    statusCode: 200,
    data: users,
  });
};

module.exports = {
  getUsers,
};
