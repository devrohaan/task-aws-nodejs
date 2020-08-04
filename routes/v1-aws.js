// will contain all of my user related routes
const express = require('express');
const router = express.Router();
const awsSDK = require('aws-sdk');
const awsRegion = require('aws-regions');
const transform = require("node-json-transform").transform;

const regionObjectMapper = function (data){
    return transform(
        data, {
            item: {
                region_name :"name",
                region_full_name: "full_name",
                region_code: "code"
            }
        });
};
const vpcObjectMapper = function (data){
    return transform(
        data, {
            item: {
                vpc_id :"VpcId",
                state: "State",
                cidr_block: "CidrBlock"
            }
        });
};

const vpcErrorObjectMapper = function (data){
    return transform(
        data, {
            item: {
                error_message :"message",
                error_code: "code"
            }
        });
};

const subnetObjectMapper = function (data){
    return transform(
        data, {
            item: {
                subnet_id :"SubnetId",
                state: "AvailabilityZone",
                cidr_block: "State",
                vpc_id: "VpcId"
            }
        });
};

router.get('/regions', (req, res) => {
    let data = regionObjectMapper(awsRegion.list());
    res.status(200).json(data);
});

router.get("/regions/:region_code/vpcs", (req, res) => {
    let _region = req.params.region_code;
    awsSDK.config.update({region: _region});
    const ec2 = new awsSDK.EC2();
    const params = {};
    ec2.describeVpcs(params, function(err, data) {
        if (err) {
            let _err = vpcErrorObjectMapper(err);
            res.status(400).json(_err);
        } else {
            let _data = vpcObjectMapper(data.Vpcs);
            res.status(200).json(_data);
        }
    });
});

router.get('/regions/:region_code/vpcs/:vpc_id/subnets', (req, res) => {
    let _region = req.params.region_code;
    let _vpcId = req.params.vpc_id;
    awsSDK.config.update({region: _region});
    const ec2 = new awsSDK.EC2();
    const params = {
        Filters: [
            {
                Name: 'vpc-id',
                Values: [
                    _vpcId
                ]
            },
        ]};
    ec2.describeSubnets(params, function(err, data) {
        if (err) {
            res.status(400).json(err);
        } else {
            let _data = subnetObjectMapper(data.Subnets);
            if (_data.length === 0)
                res.status(200).json({"message":"No Subnet available for VPC: "+_vpcId});
            else
                res.status(200).json(_data);
        }
    });
});

module.exports = router;
