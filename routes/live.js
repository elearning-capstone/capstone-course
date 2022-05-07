const axios = require("axios");
const express = require("express");
const router = express.Router();
const { studyCheckMiddleware, teachCheckMiddleware, getCourseIdFromLiveMiddleware } = require("../middleware");

const live_ip = "";
const survey_ip = "";

router.post("/survey", [getCourseIdFromLiveMiddleware, teachCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.post(survey_ip + "/survey/live_survey", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;