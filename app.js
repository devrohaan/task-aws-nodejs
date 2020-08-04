const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/v1-aws.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/aws/", router);


app.get("/", (req, res) => {
  res.send("<h1>Welcome to Druva's AWS Open APIS to List Regions, VPCs, and Subnets!</h1>");
});

app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})
