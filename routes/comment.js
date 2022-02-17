const express = require("express");
const axios = require("axios");
const router = express.Router();

const course_ip = "";

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(course_ip + "/comment", { headers: { user: req.headers['user'] }, params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;