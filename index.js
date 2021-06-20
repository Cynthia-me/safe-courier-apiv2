const express = require('express');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")


const options = {
    definition : {
        openapi : "3.0.0",
        info : {
            title: "Safe Courier API",
            version : "1.0.0",
            description : "a courier service that helps users deliver parcels to different destinations"
        },
        servers: [
            {
                url : "http://localhost:4000"
            }
        ],
    },
    apis: ["./Routes/*.js"]
}
const specs = swaggerJsDoc(options)

const app = express();

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))

const parcelRoutes = require('./Routes/parcels.js'); 
const userRoutes = require('./Routes/auth.js');
const adminRoutes = require('./Routes/admin.js');

dotenv.config();

const port = process.env.PORT || 3500

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v2/parcels',parcelRoutes);
app.use('/api/v2/users',userRoutes);
app.use('/api/v2/admin',adminRoutes)

app.get('/',(req,res)=>{
    res.send("WELCOME TO SAFE COURIER");
});


app.listen(port,function(req,res){
    console.log(`Server is running on port ${port}`);
});
