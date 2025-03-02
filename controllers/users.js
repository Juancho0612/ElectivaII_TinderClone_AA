const users = require("../data/users");

/**
 * Obtiene la lista de usuarios si las credenciales son correctas.
 * @param {Object} req - Solicitud de Express con parámetros de autenticación.
 * @param {Object} res - Respuesta de Express.
 */
const getUsers = (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const currentuser = users?.find(
    (user) => user.username === username && user.password === password
  );

  if (!currentuser) {
    res.status(403).json({
      message: "Incorrect username or password",
    });
    return;
  }

  res.status(200).json(users);
};

/**
 * Crea un nuevo usuario si el email, username y teléfono no están registrados.
 * @param {Object} req - Solicitud de Express.
 * @param {Object} req.body - Datos del usuario.
 * @param {Object} res - Respuesta de Express.
 */
const createUser = (req, res) => {
  const body = req.body;

  const id = users?.length + 1;

  const existingEmail = users?.some((user) => user.email === body.email);
  const existingUsername = users?.some(
    (user) => user.username === body.username
  );
  const existinPhone = users?.some((user) => user.phone === body.phone);

  if (existingUsername) {
    res.status(200).json({
      message: "username already registered",
    });
    return;
  }

  if (existingEmail) {
    res.status(200).json({
      message: "email already registered",
    });
    return;
  }

  if (existinPhone) {
    res.status(200).json({
      message: "phone already registered",
    });
    return;
  }

  const user = {
    id: Number(id),
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    username: body.username,
    password: body.password,
    phone: body.phone ?? null,
  };

  users?.push(user);

  res.status(201).json({
    message: "the user has been registered",
    body: user,
  });
};


/**
 * Obtiene un usuario por su ID si las credenciales son correctas.
 * @param {Object} req - Solicitud de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {Object} req.query - Parámetros de autenticación.
 * @param {Object} res - Respuesta de Express.
 */
const getuser = (req, res) => {
  const id = req.params.id;

  const username = req.query.username;
  const password = req.query.password;

  const currentuser = users?.find(
    (user) => user.username === username && user.password === password
  );

  if (!currentuser) {
    res.status(403).json({
      message: "Incorrect username or password",
    });
    return;
  }

  const user = users?.find((user) => user.id === Number(id));

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }

  res.status(200).json(user);
};

/**
 * Autentica a un usuario con su nombre de usuario y contraseña.
 * @param {Object} req - Solicitud de Express.
 * @param {Object} req.body - Datos de autenticación.
 * @param {Object} res - Respuesta de Express.
 */
const login = (req, res) => {
  const body = req.body;

  const { username, password } = body;

  const user = users?.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    res.status(401).json({ message: "Incorrect user or password" });
    return;
  }
  res.status(200).json({
    message: "Successful login",
  });
};

module.exports = {
  getUsers,
  createUser,
  login,
  getuser,
};
