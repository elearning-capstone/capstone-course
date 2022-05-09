module.exports = (sequelize, DataTypes) => {
    const course = sequelize.define("course", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        requirement: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        survey_group_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });

    course.associate = (models) => {
        course.hasMany(models.study, {
            foreignKey: "course_id",
        });
        course.hasOne(models.teach, {
            foreignKey: "course_id",
        });
    };

    return course;
}