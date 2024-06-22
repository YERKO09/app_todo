import "dotenv/config";
import bcript from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await userModel.create({
      username,
      email,
      password: bcript.hashSync(password, 10),
    });

    return res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);

    // recuerda que estos códigos de error los puedes modularizar como vimos en todo.controller.js
    if (error.code === "23505") {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await userModel.findOneEmail(email);
    if (!user) {
      return res.status(400).json({ message: "No se encontró el usuario" });
    }

    const isMatch = bcript.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // creación del payload
    const payload = {
      username,
      email,
      user_id: user.user_id,
    };

    // creación del token
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Inicio de sesión exitosa",
      token,
      email,
      username
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userController = {
  login,
  register,
};
