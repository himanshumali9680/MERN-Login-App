import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
const app = express();
/* const path = require("path");
 */
//import connect from './database/conn.js';
//const router = require('./router/route');
//const templatePath = path.join(__dirname, '../tempelates')


/**middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 4001;

/**HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET asd ");

})

/**api routes */
//app.use('/api', router)



/**start server only when we have valid connection */
connect().then(() => {
    try{
        app.listen(port,() => {
            console.log(`server connected to http://localhost:${port}`);
        })

    } catch (error) {
        console.log('cannot connect')
    }
}).catch(error => {
    console.log('Invalid databse connection');
})