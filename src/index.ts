// ts-node src/index.ts
import express, { Router } from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
//import walletRoute from './routes/wallet.js'
import router from './routes/auth';
import productRoute from './routes/products';
import * as dotenv from 'dotenv'

dotenv.config()


const DBNAME = 'Shopify'

const app = express()


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());




app.use('/auth', router)
app.use('/', productRoute)


mongoose.set("strictQuery", false);
mongoose.connect(`mongodb+srv://technocyUser:${process.env.DBPASSWORD}@cluster0.9bbxu.mongodb.net/?retryWrites=true&w=majority`);




// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

app.get('/', (req, res) => {
    res.send('good morning')
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});



