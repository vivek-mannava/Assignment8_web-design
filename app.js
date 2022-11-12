let express = require("express");
let app = express();
let mongoose = require("mongoose");
let morgan = require("morgan");  //Using morgan for middleware
let bodyParser = require("body-parser");
let expressValidator = require("express-validator");
let dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).then(() => console.log("DB Connected"));
mongoose.connection.on('error',err => {
    console.log(`Error in Connecting DB ${err}`);
})

let routes = require("./routes/route");

app.use(morgan("dev")); 
app.use(bodyParser.json());
app.use(expressValidator());
app.use('/', routes); // Here "/" is the request part 

let port = process.env.PORT;
app.listen(port, () => {
    console.log(`You are getting listened on Port ${port}`);
});