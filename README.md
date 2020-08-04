# task-aws-nodejs

Following app is build using NodeJs to build the Rest API.

# Running the Application

To run the application you need to have Node and npm installed on the system.

To download node dependencies

> npm install

To start the application run the following command

> npm start

To Test the Rest APIs please visit Swagger Documentation. Please open the URL http://localhost:3003/api-docs

# API's

Following are the list of apis that the backend Provides.

> /api/v1/aws/regions

GET: Get All AWS regions

> /api/v1/aws/regions/{region_code}/vpcs

GET: Get all VPCs of specific region

> /api/v1/aws/regions/{region_code}/vpcs/{vpc_id}/subnets

GET: Get all Subnets of specific VPC
