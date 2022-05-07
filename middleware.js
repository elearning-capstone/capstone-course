const { course, study } = require("./models");

exports.courseCheckMiddleware = async (req, res, next) => {
    try {
        if (!req.query.course_id) {
            return res.status(400).json({ message: "missing course id" });
        }

        let count = await course.count({
            where: {
                id: req.query.course_id,
            }
        });

        if (count == 0) {
            return res.status(404).json({ message: "course not found" });
        }
    } catch (err) {
        return res.status(404).json({ message: "not found" });
    }

    next();
};

exports.studyCheckMiddleware = async (req, res, next) => {
    try {
        if (!req.query.course_id) {
            return res.status(400).json({ message: "missing course id" });
        }

        if (req.query.role == "lecturer") {
            let count = await teach.count({
                where: {
                    user_id: req.query.user_id,
                    course_id: req.query.course_id,
                }
            });

            if (count != 0){
                next();
            }
        }

        let count = await study.count({
            where: {
                user_id: req.query.user_id,
                course_id: req.query.course_id,
            }
        });

        if (count == 0) {
            return res.status(403).json({ message: "user must study this course" });
        }
    } catch (err) {
        return res.status(404).json({ message: "not found" });
    }

    next();
};

exports.teachCheckMiddleware = async (req, res, next) => {
    try {
        if (!req.query.course_id) {
            return res.status(400).json({ message: "missing course id" });
        }

        let count = await teach.count({
            where: {
                user_id: req.query.user_id,
                course_id: req.query.course_id,
            }
        });

        if (count == 0){
            return res.status(403).json({ message: "user must teach this course" });
        }
    } catch (err) {
        return res.status(404).json({ message: "not found" });
    }

    next();
};