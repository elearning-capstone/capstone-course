const express = require("express");
const router = express.Router();
const { study, course } = require("../models");

router.get("/all", async (req, res) => {
    try {
        return course.findAll({
            attributes: [ 'id', 'name', 'description' ],
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { course_id } = req.body;

        let count_course = course.count({
            where: {
                id: course_id,
            }
        });

        let count_study = study.count({
            where: {
                user_id: req.user.user_id,
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
            user_id: req.user.user_id,
            course_id,
        });

        return res.json({ message: "success" });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

module.exports = router;