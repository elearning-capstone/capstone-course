const express = require("express");
const axios = require("axios");
const router = express.Router();
const { courseCheckMiddleware } = require("../middleware");

const course_ip = "";

router.get("/", courseCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.get(course_ip + "/comment", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;