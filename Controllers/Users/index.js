const UserModels = require("../../Models/scheme/User");
require("dotenv").config();
const Cryptr = require("cryptr");
const CryptrNew = new Cryptr("Ems1");

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

async function userPost(req, res, next) {
  const { username, password, email, role } = req.body;
  const tokenJWT = req.tokenUser.data;
  try {
    const getUser = await UserModels.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!username || !password || !email || !role) {
      res.status(401).send({
        message: "Data tidak Komplit",
        statusCode: 401,
      });
    }

    if (getUser) {
      res.status(401).send({
        message: "Akun Sudah Tersedia, Buat akun baru!",
        statusCode: 401,
      });
    } else {
      let data = {
        username: username,
        password: CryptrNew.encrypt(password),
        email: email,
        active: true,
        role: role,
        business_id: tokenJWT.business_id,
        create_at: Date.now(),
      };

      let createdData = await UserModels.create(data);

      if (!createdData) {
        res.status(401).send({
          message: "username atau password salah",
          statusCode: 401,
        });
      }
      res.status(201).send({
        message: "Berhasil membuat user baru",
        statusCode: 201,
        data: createdData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "ada yang salah",
      error: error,
      statusCode: 500,
    });
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteUser = await UserModels.findByIdAndDelete(id);

    if (!deleteUser) {
      res.status(404).json({
        message: "User tidak ditemukan",
        statusText: "User tidak ditemukan",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Berhasil Menghapus Data",
        statusText: "Berhasil Menghapus Data",
        statusCode: 200,
        data: deleteUser,
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

const UpdateUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const tokenJWT = req.tokenUser.data;

    const updateUser = {
      username: username,
      email: email,
    };

    // Cek apakah password yang dikirim tidak null
    if (password !== null && password !== undefined) {
      updateUser.password = CryptrNew.encrypt(password);
    }

    const updatedUserData = await UserModels.findByIdAndUpdate(
      tokenJWT.user_id,
      updateUser,
      { new: true }
    );

    if (!updatedUserData) {
      res.status(404).json({
        message: "User Tidak Ditemukan",
        statusText: "User Tidak Ditemukan",
        statusCode: 404,
      });
    } else {
      res.send({
        message: "Berhasil Mengupdated User",
        statusText: "Berhasil Mengupdated User",
        statusCode: 200,
        data: updatedUserData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Kesalahan server",
      statusText: "Kesalahan server",
      statusCode: 500,
    });
  }
};

module.exports = {
  getUsers,
  userPost,
  deleteUser,
  UpdateUser,
};
