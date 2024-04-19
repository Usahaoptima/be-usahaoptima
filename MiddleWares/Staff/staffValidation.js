const validateStaffCreation = (req, res, next) => {
  const { staff_name, salary, phone_number, email } = req.body;

  // Validasi staff_name
  if (!staff_name || staff_name.trim() === "") {
    return res.status(400).json({ error: "Nama karyawan diperlukan." });
  }

  // Validasi salary
  if (!salary || isNaN(salary)) {
    return res.status(400).json({ error: "Gaji harus berupa angka." });
  }

  // Validasi phoneNumber (gunakan regex Indonesia)
  const phoneNumberRegex = /^(\+62|0)[0-9]{8,15}$/;
  if (!phoneNumberRegex.test(phone_number)) {
    return res.status(400).json({ error: "Format nomor telepon tidak valid." });
  }

  // Validasi email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format email tidak valid." });
  }

  next();
};

const validateStaffUpdate = (req, res, next) => {
  const { salary, phone_number, email } = req.body;

  // Validasi salary
  if (salary !== undefined && (isNaN(salary) || salary < 0)) {
    return res.status(400).json({ error: "Gaji harus berupa angka positif." });
  }

  // Validasi phoneNumber (gunakan regex Indonesia)
  if (phone_number !== undefined) {
    const phoneNumberRegex = /^(\+62|0)[0-9]{8,15}$/;
    if (!phoneNumberRegex.test(phone_number)) {
      return res
        .status(400)
        .json({ error: "Format nomor telepon tidak valid." });
    }
  }

  // Validasi email
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format email tidak valid." });
    }
  }

  next();
};

module.exports = { validateStaffCreation, validateStaffUpdate };
