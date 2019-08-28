const express =  require('express');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;
