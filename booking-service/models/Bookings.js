const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.STRING, // Could be an ObjectId if referring to MongoDB
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING",
    },
    numTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { timestamps: true });

module.exports = Booking;
