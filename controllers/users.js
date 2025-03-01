const users = require("../data/users");

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
