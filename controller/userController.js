const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const model = require("../model/index");
const jwt = require("jsonwebtoken");
module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, nama } = req.body;
  const hashedPasword = await bcrypt.hash(password, 10);
  try {
    await model.User.create({
      email: email,
      password: hashedPasword,
      nama: nama,
    });
    res.status(200).send({
      message: "sukses",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const data = await model.User.findOne({
      attributes: ["id", "nama", "email", "password"],
      where: {
        email: email,
      },
    });
    if (data && (await bcrypt.compare(password, data.password))) {
      const payload = {
        user_id: data.id,
        nama: data.nama,
        email: data.email,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({
        token: token,
      });
    } else {
      res.status(500).json({
        message: "data tidak ditemukan",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
