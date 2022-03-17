const axios = require("axios");
const express = require("express");
const router = express.Router();
const { study, course } = require("../models");

const review_ip = "http://ip-172-31-37-115.ap-southeast-1.compute.internal:3000";
const survey_ip = "http://ip-172-31-37-162.ap-southeast-1.compute.internal:3000";

router.get("/", async (req, res) => {
    try {
        let courses = await course.findAll({
            attributes: [ 'id', 'name', 'description' ],
            raw: true
        });

        let course_ids = [];

        courses.forEach(course => course_ids.push(course.id));

        const response = await axios.get(review_ip + "/review/average", { params: { course_id: course_ids } });

        for (let i = 0; i < courses.length; i++) {
            let id = courses[i].id.toString();
            courses[i].avgReview = response.data[id].avgReview;
            courses[i].countReview = response.data[id].countReview;
        }

        return res.json({
            course: courses
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.get("/study", async (req, res) => {
    try {
        const { user_id, course_id } = req.query;

        if (course_id) {
            let count = await study.count({
                where: {
                    user_id: user_id,
                    course_id: course_id,
                }
            });

            if (count == 0) {
                return res.status(403).json({ message: "user must study this course" });
            }

            let course = await course.findOne({
                where: { course_id },
                attributes: [ 'id', 'name', 'description', 'survey_group_id' ],
            });

            const avgReview_res = await axios.get(review_ip + "/review/average", { params: { course_id: course_id } });
            const is_review_res = await axios.get(review_ip + "/review/is_review", { params: { course_id: course_id, user_id: user_id } });
            const is_survey_res = await axios.get(survey_ip + "/survey/is_survey", { params: { survey_id: course.survey_group_id, user_id: user_id } });
            
            let id = course_id.toString();
            course.avgReview = avgReview_res[id].avgReview;
            course.countReview = avgReview_res[id].countReview;
            course.is_review = is_review_res.is_review;
            course.is_survey = is_survey_res.is_survey;

            return res.json({
                course: courses
            });
        }

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
        const { name, description, requirement, survey_group_id } = req.body;

        if (typeof name != "string" || typeof description != "string" || typeof requirement != "number") {
            return res.status(400).json({ message: "invalid name, description or requirement" })
        }

        let new_course = await course.create({
            name,
            description,
            requirement,
            survey_group_id
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