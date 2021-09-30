require('dotenv').config()
const mongoose = require("mongoose")
const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")

//Routs
const authRouts = require('./routes/auth')
const userRouts = require('./routes/user')
const categoryRouts = require('./routes/category')
const productRouts = require('./routes/product')
const orderRouts = require("./routes/order")
const paymentBRoutes = require("./routes/paymentBRoutes");


mongoose.connect("mongodb://localhost:27017/tshirt", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
}).then(() => {
        console.log("DB CONNECTED")
})
//middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())


//my routs

app.use("/api", authRouts);
app.use("/api", userRouts);
app.use("/api", categoryRouts);
app.use("/api", productRouts);
app.use("/api", orderRouts);
app.use("/api", paymentBRoutes);
//port 
const port = 3004;
app.listen(port, () => {
        console.log(`app is running at ${port}`);
});





//approach - 2

// const start = async function(){
//     await mongoose.connect("mongodb://localhost:27017/tshirt",{
//         useNewUrlParser:true,
//         useUnifiedTopology: true,
//         useCreateIndex : true
//     }).then( () =>{
//         console.log("Connected to DB");
//     }).catch(err =>{
//         console.log(err)
//     })


//      const port = 8000;
//      app.listen(port,() =>{
//      console.log(`app is running at ${port}`); 
//      });
//     }

// start();    






// mongoose.connect(process.env.DATABASE,{
//         useNewUrlParser:true,
//         useUnifiedTopology: true,
//         useCreateIndex : true
//     }).then( () =>{


//         console.log("DB CONNECTED")
//         const port = 8000;
//         app.listen(port,() =>{
//         console.log(`app is running at ${port}`); 
//         });



//     }).catch(err =>{console.log(err);})





