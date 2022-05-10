const axios = require("axios");
const express = require("express");
const router = express.Router();
const { studyCheckMiddleware, teachCheckMiddleware, getCourseIdFromLiveMiddleware } = require("../middleware");

const live_ip = "http://ip-172-31-38-32.ap-southeast-1.compute.internal:3000";
const survey_ip = "http://ip-172-31-37-162.ap-southeast-1.compute.internal:3000";

router.post("/survey", [getCourseIdFromLiveMiddleware, teachCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.post(survey_ip + "/survey/live_survey", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.get("/", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.get(live_ip + "/live", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.get("/sync", [getCourseIdFromLiveMiddleware, studyCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.get(live_ip + "/live/sync", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/chat", [getCourseIdFromLiveMiddleware, studyCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.post(live_ip + "/live/chat", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/", [getCourseIdFromLiveMiddleware, studyCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.post(live_ip + "/live/", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.put("/info", [getCourseIdFromLiveMiddleware, studyCheckMiddleware], async (req, res) => {
    try {
        const response = await axios.put(live_ip + "/live/info", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;