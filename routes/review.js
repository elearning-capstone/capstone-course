const express = require("express");
const axios = require("axios");
const router = express.Router();
const { studyCheckMiddleware } = require("../middleware");

const review_ip = "";

router.get("/", courseCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.get(review_ip + "/review", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/create", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(review_ip + "/review/create", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;