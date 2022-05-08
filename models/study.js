const axios = require("axios");

const course_ip = "http://ip-172-31-36-250.ap-southeast-1.compute.internal:3000";

module.exports = (sequelize, DataTypes) => {
    const study = sequelize.define("study", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        progression: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        }
    });

    study.associate = (models) => {
        study.belongsTo(models.course, {
            foreignKey: "course_id",
        });
    };

    study.afterUpdate(async (study, options) => {
        try {
            const user_id = study.dataValues.user_id;
            const course_id = study.dataValues.course_id;
            const progression = study.dataValues.progression;
            await axios.get(course_ip + "/course/checkprogress", { params: { user_id, course_id, progression } });
        } catch(err) {
            console.log(err);
        }
    });

    return study;
}