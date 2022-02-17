const express = require("express");
const axios = require("axios");
const router = express.Router();

const review_ip = "";

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(review_ip + "/review");
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/create", userCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(review_ip + "/review/create", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;