const logger = require('../utils/logger');
const express = require('express');
const partner = require('../helper/partner');

const listPlacesByLongLat = async(req, res, next) => {

    const long = parseFloat(req.query.long);
    const lat = parseFloat(req.query.lat);

    try {
        const places = await partner.listNearyByPlaces(long, lat);

        // Results not found
        if (places === 'ERROR' || places.length === 0) {
            throw new Error('error')
        }
        
        const cuisines = await partner.filterCuisines(places);
        const services = await partner.filterServices(places);
        const typeAvailable = await partner.filterType(places);

        logger.info(`Returning places: ${places}`);

        return res.status(200).json({
            status: 200,
            total: places.length,
            type: typeAvailable,
            services: services,
            cuisines: cuisines,
            places: places
        })
        
    } catch(err) {
        
        logger.info(`No partner found nearby: ${long} - ${lat}`);

        return res.status(500).json({
            status: 500,
            message: process.env.NO_PLACE_FOUND
        })

    }

};

const getPlaceMenu = async(req, res, next) => {
    
}

module.exports = {
    listPlacesByLongLat
}