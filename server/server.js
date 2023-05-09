const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const path = require("path");

//const templatePath = path.join(__dirname, '../tempelates')


/**middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8000;

/**HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET ");

})


/**start server */
app.listen(port, () => {
    console.log('Server connected');
})