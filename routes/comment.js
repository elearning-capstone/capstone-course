const express = require("express");
const axios = require("axios");
const router = express.Router();
const { studyCheckMiddleware } = require("../middleware");

const comment_ip = "";

router.get("/", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.get(comment_ip + "/comment", { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(comment_ip + "/comment", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/reply", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(comment_ip + "/comment/reply", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/like", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(comment_ip + "/comment/like", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

router.post("/unlike", studyCheckMiddleware, async (req, res) => {
    try {
        const response = await axios.post(comment_ip + "/unlike", req.body, { params: req.query });
        return res.json(response.data);
    } catch (err) {
        return res.status(err.response.status || 404).json(err.response.data || { message: "not found" });
    }
});

module.exports = router;