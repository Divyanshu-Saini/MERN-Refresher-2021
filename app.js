require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const { MONGOURI, DB_NAME, PORT } = process.env;

mongoose.connect(`${MONGOURI}${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.info('Connected to mongoDb server');
});
mongoose.connection.on('error', (error) => {
  console.error('Some Error occured', error);
});
require('./models/user');
require('./models/post');

app.use(cors());
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.info(`Server started at port ${PORT}`);
});
