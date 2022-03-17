const express = require("express");
const router = express.Router();
const { study, course } = require("../models");

const review_ip = "http://ip-172-31-37-115.ap-southeast-1.compute.internal:3000";

router.get("/", async (req, res) => {
    try {
        let courses = await course.findAll({
            attributes: [ 'id', 'name', 'description' ],
        });

        let course_ids = [];

        courses.forEach(course => course_ids.push(course.id));

        const response = await axios.get(review_ip + "/review/average", { params: course_ids });

        courses.map(course => {
            let id = course.id.toString()
            course.avgReview = response[id].avgReview
            course.countReview = response[id].countReview
        });

        return res.json({
            course: courses
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.get("/study", async (req, res) => {
    try {
        const { user_id } = req.query;

        let courses = await course.findAll({
            attributes: [ 'id', 'name', 'description' ],
            include: {
                model: study,
                required: true,
                where: {
                    user_id,
                },
            }
        });

        return res.json({
            course: courses
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { name, description, requirement } = req.body;

        if (typeof name != "string" || typeof description != "string" || typeof requirement != "number") {
            return res.status(400).json({ message: "invalid name, description or requirement" })
        }

        let new_course = await course.create({
            name,
            description,
            requirement
        });

        return res.json({
            course: new_course
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { user_id, course_id } = req.query;

        let count_course = course.count({
            where: {
                id: course_id,
            }
        });

        let count_study = study.count({
            where: {
                user_id,
                course_id,
            }
        })

        if (await count_course == 0) {
            return res.status(404).json({ message: "course not found" });
        }

        if (await count_study != 0) {
            return res.status(400).json({ message: "already register" });
        }

        await study.create({
            user_id,
            course_id,
        });

        return res.json({ message: "success" });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

module.exports = router;