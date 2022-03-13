const express = require("express");
const axios = require("axios");
const router = express.Router();
const { courseCheckMiddleware, studyCheckMiddleware } = require("../middleware");

const review_ip = "http://ip-172-31-37-115.ap-southeast-1.compute.internal:3000";

router.get("/", courseCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.get(review_ip + "/review", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(review_ip + "/review", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;