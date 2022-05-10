module.exports = (sequelize, DataTypes) => {
    const video = sequelize.define("video", {
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
        video_url: {
            type: DataTypes.STRING,
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
        }
    });

    video.associate = (models) => {
        video.belongsTo(models.course, {
            foreignKey: "course_id",
        });
    };

    return video;
}