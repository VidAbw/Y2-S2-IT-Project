const { model, Schema } = require("mongoose");

const ReservationSchema = new Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    tableNumber: { 
      type: Number, 
      required: true 
    },
    reservationDate: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true 
    },
    endTime: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    // Uncomment if you need to add the numberOfGuests field:
    // numberOfGuests: {
    //   type: Number,
    //   required: true
    // },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

const ReservationModel = model("reservation", ReservationSchema);
module.exports = { ReservationModel };
