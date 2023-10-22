const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.post("/", async function (req, res, next) {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    //return next(new Error("username and password are required"));
    return res.status(409).json(
      jsonResponse(409, {
        error: "Usuario y contraseña requeridos",
      })
    );
  }

  try {
    const user = new User();
    const userExists = await user.usernameExists(username);

    if (userExists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Usuario ya registrado",
        })
      );
      //return next(new Error("user already exists"));
    } else {
      const user = new User({ username, password, name });

      user.save();

      res.json(
        jsonResponse(200, {
          message: "Usuario creado exitosamente",
        })
      );
    }
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error creando usuario",
      })
    );
    //return next(new Error(err.message));
  }
});

module.exports = router;
