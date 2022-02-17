const express = require("express");
const router = express.Router();
const { study, course } = require("../models");

router.get("/", async (req, res) => {
    try {
        return course.findAll({
            attributes: [ 'id', 'name', 'description' ],
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
        const { course_id } = req.body;
        const { user_id } = req.query;

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