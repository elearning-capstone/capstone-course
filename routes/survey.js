const express = require("express");
const axios = require("axios");
const router = express.Router();
const { lecturerCheckMiddleware, teachCheckMiddleware } = require("../middleware");

const survey_ip = "http://ip-172-31-37-162.ap-southeast-1.compute.internal:3000";

router.get("/result", lecturerCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(survey_ip + "/survey/result", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/live_survey", [getCourseIdFromLiveMiddleware, teachCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.post(survey_ip + "/survey/live_survey", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;