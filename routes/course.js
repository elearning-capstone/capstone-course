const axios = require("axios");
const express = require("express");
const router = express.Router();
const { study, course, teach, video } = require("../models");
const { teachCheckMiddleware, lecturerCheckMiddleware } = require("../middleware");

const review_ip = "http://ip-172-31-37-115.ap-southeast-1.compute.internal:3000";
const survey_ip = "http://ip-172-31-37-162.ap-southeast-1.compute.internal:3000";
const cert_ip = "http://ip-172-31-43-84.ap-southeast-1.compute.internal:3000";

router.get("/", async (req, res) => {
    try {
        let courses = await course.findAll({
            attributes: [ 'id', 'name', 'description' ],
            raw: true
        });

        let course_ids = courses.map(course => course.id);

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

            let studyCourse = await course.findOne({
                where: { id: course_id },
                attributes: [ 'id', 'name', 'description', 'survey_group_id' ],
                raw: true
            });

            const review_promise = axios.get(review_ip + "/review/average", { params: { course_id: course_id } });
            const is_review_promise = axios.get(review_ip + "/review/is_review", { params: { course_id: course_id, user_id: user_id } });
            const is_survey_promise = axios.get(survey_ip + "/survey/is_survey", { params: { survey_id: studyCourse.survey_group_id, user_id: user_id } });
            
            const review_res = await review_promise;
            let id = course_id.toString();
            studyCourse.avgReview = review_res.data[id].avgReview;
            studyCourse.countReview = review_res.data[id].countReview;

            const is_review_res = await is_review_promise;
            studyCourse.is_review = is_review_res.data.is_review;

            const is_survey_res = await is_survey_promise;
            studyCourse.is_survey = is_survey_res.data.is_survey;

            return res.json({
                course: studyCourse
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
            },
            raw: true
        });

        if (courses.length == 0) {
            return res.json({
                course: []
            });
        }

        let course_ids = courses.map(course => course.id);

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

router.get("/teach", lecturerCheckMiddleware, async (req, res) => {
    try {
        const { user_id } = req.query;

        let courses = await course.findAll({
            attributes: [ 'id', 'name', 'description' ],
            include: {
                model: teach,
                attributes: [],
                required: true,
                where: {
                    user_id,
                },
            },
            raw: true
        });

        if (courses.length == 0) {
            return res.json({
                course: []
            });
        }

        let course_ids = courses.map(course => course.id);

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
        console.log(err);
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { name, description, requirement, lecturer_id, survey_group_id } = req.body;

        if (typeof name != "string" || typeof description != "string" || typeof requirement != "number" || typeof lecturer_id != "number") {
            return res.status(400).json({ message: "invalid name, description, requirement or lecturer_id" })
        }

        let new_course = await course.create({
            name,
            description,
            requirement,
            survey_group_id
        });

        let new_teach = await teach.create({
            user_id: lecturer_id,
            course_id: new_course.id
        });

        return res.json({
            course: new_course,
            lecturer_id: new_teach.user_id
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

router.put("/studyprogress", async (req, res) => {
    try {
        const { progression } = req.body;
        const { course_id, user_id } = req.query;

        if (!course_id || !user_id) {
            return res.status(400).json({ message: "missing course_id, user_id" });
        }

        if (typeof progression != "number") {
            return res.status(400).json({ message: "invalid progression" })
        }

        let count = await study.count({
            where: {
                user_id: user_id,
                course_id: course_id
            },
        });

        if (count == 0) {
            return res.status(404).json({ message: "invalid user_id or course_id" });
        };

        await study.update({ progression: progression }, {
            where: {
                user_id: user_id,
                course_id: course_id
            },
            individualHooks: true
        });

        return res.json({ message: "success" });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.get("/information", async (req, res) => {
    try {
        const { course_id } = req.query;

        const course_info = await course.findOne({
            where: {
                id: course_id
            }
        });

        if(!course_info) {
            return res.status(400).json({ message: "course not exist" });
        }

        const teach_info = await teach.findOne({
            where: {
                course_id
            }
        });

        if(!teach_info) {
            return res.status(400).json({ message: "no teach information found" });
        }

        return res.json({
            course_id: course_info.id,
            name: course_info.name,
            description: course_info.description,
            lecturer_id: teach_info.user_id
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.get("/checkprogress", async (req, res) => {
    try {
        const { user_id, course_id, progression } = req.query;

        const course_info = await course.findOne({
            where: {
                id: course_id
            }
        });

        if (progression >= course_info.requirement) {
            await axios.get(cert_ip + "/cert", { params: { user_id, course_id } });
        }

        return res.json({ message: "success" });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/video", teachCheckMiddleware, async (req, res) => {
    try {
        const { course_id } = req.query;
        const { name, description, video_url } = req.body;
        
        if (typeof video_url != "string") {
            return res.status(400).json({ message: "invalid video_url" })
        }

        const new_video = await video.create({
            name,
            description,
            video_url,
            course_id,
        });

        return res.json({
            video: new_video
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.get("/videos", async (req, res) => {
    try {
        const { course_id } = req.query;

        const videos = await video.findAll({
            attributes: [ 'name', 'description', 'video_url' ],
            order: [ [ 'createdAt', 'DESC' ] ],
            where: {
                course_id
            },
            raw: true
        });

        return res.json({ videos: videos });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

module.exports = router;