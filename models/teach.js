module.exports = (sequelize, DataTypes) => {
    const teach = sequelize.define("teach", {
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
    });

    teach.associate = (models) => {
        teach.belongsTo(models.course, {
            foreignKey: "course_id",
        });
    };

    return teach;
}