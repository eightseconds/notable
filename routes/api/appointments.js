const express = require("express");
const router = express.Router();
const appointments = require("../../models/Appointments");
const moment = require('moment')
const uuid = require('uuid');

// // Gets all appointments
// router.get("/", async (req, res) => {
//   try {
//     let appointments = await appointments;
//     res.json(appointments);
//   } catch(err) {
//     return err;
//   }
// });


//Get appointment for doctor
router.get('/:doctorId', async (req, res) => {
  try {
    const filteredAppointments = appointments.filter(appointment => appointment.doctorId === parseInt(req.params.doctorId))
    res.json(filteredAppointments);
  } catch(err) {
    return err
  }
})

//Get appointment for date
router.get('/:timestamp', async(req, res) => {
  try {
    const filteredAppointments = appointments.filter(appointment => appointment.timeStamp === req.params.timeStamp)
    res.json(filteredAppointments)
  } catch(err) {
    return err;
  }
})


//Delete Appointment
router.delete('/:id', async(req, res) => {
  try {
    appointments.some(appointment => appointment.id === parseInt(req.params.id));
    res.json({ msg: 'Appointment deleted', appointments : appointments.filter(appointment => appointment.id !== parseInt(req.params.id))})
  } catch(err) {
    return err;
  }
})

// Create Appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = {
    id: uuid.v4(),
    timeStamp: req.body.timeStamp,
    pFirstName: req.body.pFirstName,
    pLastName: req.body.pLastName,
    kind: req.body.kind,
    doctorId: req.body.doctorId
  };

  const doctorsAppointments = appointments.filter(
    appointment => appointment.doctorId === newAppointment.doctorId
  );

  for (const appointment of doctorsAppointments) {
    var count = 0
    if (newAppointment.timestamp === appointment.timeStamp) count++
  }

  if (count >= 3) throw new Error("Doctor is fully booked for that time.")
  

  if (moment(newAppointment.timestamp).format(m) % 15 !== 0) {
    throw new Error("New appointments can only start at 15 minute intervals")
  }

  await appointments.push(newAppointment)

  const newSchedule = appointments.filter(
    appointment => appointment.doctorId === newAppointment.doctorId
  );

  res.json(newSchedule)
  } catch (err) {
    return "error"
  }
});
module.exports = router;
