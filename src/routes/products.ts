import express, { Router } from 'express'



const productRoute = Router()


// productRoute.get('', (req,res) => {
//     res.send('available products')
// })



productRoute.get('/products', (req, res) => {
    res.send('Hello, World!');
});

export default productRoute