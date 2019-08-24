const express =  require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
require('./db/mongoose');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
    console.log('App is listening on port ' + port)
});
