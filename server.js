const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };

    users.push(user);

    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.post('/users/login', async (req, res) => {
  const user = users.find((usr) => usr.name === req.body.name);
  console.log(user);
  if (user == null) {
    return res.status(400).send('cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('success');
    }
    res.send('not allowed');
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
