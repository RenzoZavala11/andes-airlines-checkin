// Importar todos los modelos
import { passenger } from './Passenger.js';
import { boarding_pass } from './Boarding_pass.js';
import { flight } from './Flight.js';
import { purchase } from './Purchase.js';
import { seat } from './Seat.js';
import { seat_type } from './Seat_type.js';
import { Airplane } from './Airplane.js';

// Definir todas las relaciones
// Passenger <-> BoardingPass
passenger.hasMany(boarding_pass, {
  foreignKey: "passenger_id",
  as: "BoardingPasses"
});
boarding_pass.belongsTo(passenger, {
  foreignKey: "passenger_id",
  as: "Passenger"
});

// Flight <-> BoardingPass
flight.hasMany(boarding_pass, {
  foreignKey: "flight_id",
  as: "BoardingPasses"
});
boarding_pass.belongsTo(flight, {
  foreignKey: "flight_id",
  as: "Flight"
});

// Purchase <-> BoardingPass
purchase.hasMany(boarding_pass, {
  foreignKey: "purchase_id",
  as: "BoardingPasses"
});
boarding_pass.belongsTo(purchase, {
  foreignKey: "purchase_id",
  as: "Purchase"
});

// Seat <-> BoardingPass
seat.hasMany(boarding_pass, {
  foreignKey: "seat_id",
  as: "BoardingPasses"
});
boarding_pass.belongsTo(seat, {
  foreignKey: "seat_id",
  as: "Seat"
});

// SeatType <-> BoardingPass
seat_type.hasMany(boarding_pass, {
  foreignKey: "seat_type_id",
  as: "BoardingPasses"
});
boarding_pass.belongsTo(seat_type, {
  foreignKey: "seat_type_id",
  as: "SeatType"
});

// SeatType <-> Seat
seat_type.hasMany(seat, {
  foreignKey: "seat_type_id",
  as: "Seats"
});
seat.belongsTo(seat_type, {
  foreignKey: "seat_type_id",
  as: "SeatType"
});

// Airplane <-> Seat
Airplane.hasMany(seat, {
  foreignKey: "airplane_id",
  as: "Seats"
});
seat.belongsTo(Airplane, {
  foreignKey: "airplane_id",
  as: "Airplane"
});

// Airplane <-> Flight
Airplane.hasMany(flight, {
  foreignKey: "airplane_id",
  as: "Flights"
});
flight.belongsTo(Airplane, {
  foreignKey: "airplane_id",
  as: "Airplane"
});

export default null;