import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import { app } from '../src/app.js'

const port = process.env.PORT || 3000

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.on('error', (error) => {
            console.log('Error:', error)
            throw error
        })
        app.listen(port, () => {
            console.log(`server is listening at port : ${port}`)
        })
    })
    .catch((error) => {
        console.log('MONGOBD Connection Failed!!', error)
    })