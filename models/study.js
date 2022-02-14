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

    return study;
}