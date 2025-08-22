import { flight as Flight } from '../models/Flight.js';
import { boarding_pass as Boarding_pass } from '../models/Boarding_pass.js';
import { passenger as Passenger } from '../models/Passenger.js';
import { seat as Seat } from '../models/Seat.js';

export class CheckinService {
  /**
   * Función principal del check-in automático que asigna asientos a pasajeros
   * Prioriza menores de edad y grupos familiares
   */
  async performAutomaticCheckin(flightId) {
    try {
      const flightData = await this.prioritizeMinorsAndLargerGroups(flightId);
      if (!flightData) return null;

      const seatsData = await this.getAirplaneSeats(flightData.airplaneId);

      // Obtener asientos disponibles por cada tipo de clase
      const availableSeatsPerClass = {
        1: await this.getAvailableSeatsByType(flightData.airplaneId, 1, flightData.passengers),
        2: await this.getAvailableSeatsByType(flightData.airplaneId, 2, flightData.passengers),
        3: await this.getAvailableSeatsByType(flightData.airplaneId, 3, flightData.passengers),
      };

      let availableSeats = [];
      // Filtrar pasajeros sin asiento asignado
      let passengers = flightData.passengers.filter(
        (passenger) => passenger.seatId == null
      );

      // Contar menores de edad para procesamiento prioritario
      let minorsCount = 0;
      for (const passenger of passengers) {
        if (passenger.age < 18) minorsCount++;
      }

      // Primer paso: Asignar asientos para menores junto a acompañantes adultos
      let processedMinorsCount = 0;
      for (const passenger of passengers) {
        if (processedMinorsCount === minorsCount) break;
        availableSeats = availableSeatsPerClass[passenger.seatTypeId];
        let seatAssigned = false;
        if (passenger.age < 18) {
          // Buscar acompañantes adultos del mismo grupo de compra
          const companions = passengers.filter(
            (companion) =>
              companion.purchaseId === passenger.purchaseId && companion.age >= 18
          );
          for (const companion of companions) {
            if (!passenger.seatId && !companion.seatId) {
              // Buscar asientos contiguos (lado a lado) para menor + adulto
              for (let i = 0; i < availableSeats.length; i++) {
                const seatId = availableSeats[i];
                const rightSeatId = this.getRightSeatId(seatId, seatsData);
                if (rightSeatId && availableSeats.includes(rightSeatId)) {
                  passenger.seatId = seatId;
                  processedMinorsCount++;
                  availableSeats.splice(i, 1);
                  passengers[passengers.indexOf(companion)].seatId = rightSeatId;
                  availableSeats.splice(availableSeats.indexOf(rightSeatId), 1);
                  seatAssigned = true;
                }
                if (seatAssigned) break;
              }
              availableSeatsPerClass[passenger.seatTypeId] = availableSeats;
            }
          }
        }
      }

      // Segundo paso: Asignar asientos restantes a adultos sin asignación
      for (const passenger of passengers) {
        availableSeats = availableSeatsPerClass[passenger.seatTypeId];
        if (passenger.age >= 18 && !passenger.seatId) {
          for (let i = 0; i < availableSeats.length; i++) {
            const seatId = availableSeats[i];
            passenger.seatId = seatId;
            availableSeats.splice(i, 1);
            break;
          }
          availableSeatsPerClass[passenger.seatTypeId] = availableSeats;
        }
      }
      return flightData;
    } catch (error) {
      console.error('Error en servicio de check-in:', error);
      throw error; // Re-lanzar para que routes/flights pueda manejar el error
    }
  }

  /**
   * Organiza pasajeros priorizando grupos con menores y por tamaño de grupo
   * Retorna la información del vuelo con pasajeros ordenados
   */
  async prioritizeMinorsAndLargerGroups(flightId) {
    const flight = await Flight.findByPk(flightId);
    if (!flight) return null;

    const boardingPasses = await Boarding_pass.findAll({
      where: { flightId },
      include: [{ model: Passenger, as: 'Passenger' }],
      order: [['seat_type_id', 'ASC'], ['seat_id', 'ASC']],
    });

    const passengerGroups = new Map();
    const groupsWithMinors = [];
    const groupsWithoutMinors = [];

    // Agrupar pasajeros por compra y formatear datos
    for (const boardingPass of boardingPasses) {
      const passengerData = boardingPass.Passenger;
      const purchaseId = boardingPass.purchaseId;
      const age = passengerData.age;
      const formattedPassenger = {
        passengerId: passengerData.passengerId,
        dni: parseInt(passengerData.dni),
        name: passengerData.name,
        age: age,
        country: passengerData.country,
        boardingPassId: boardingPass.boardingPassId,
        purchaseId: boardingPass.purchaseId,
        seatTypeId: boardingPass.seatTypeId,
        seatId: boardingPass.seatId,
      };
      if (passengerGroups.has(purchaseId)) {
        passengerGroups.get(purchaseId).push(formattedPassenger);
      } else {
        passengerGroups.set(purchaseId, [formattedPassenger]);
      }
    }

    // Separar grupos con menores de los que no tienen menores
    passengerGroups.forEach((passengers) => {
      const hasMinors = passengers.some((passenger) => passenger.age < 18);
      if (hasMinors) {
        groupsWithMinors.push(passengers);
      } else {
        groupsWithoutMinors.push(passengers);
      }
    });

    // Ordenar grupos por tamaño (más grandes primero)
    groupsWithMinors.sort((a, b) => b.length - a.length);
    groupsWithoutMinors.sort((a, b) => b.length - a.length);
    const sortedGroups = [...groupsWithMinors, ...groupsWithoutMinors];

    const flightData = {
      flightId: flight.flightId,
      takeoffDateTime: flight.takeoffDateTime,
      takeoffAirport: flight.takeoffAirport,
      landingDateTime: flight.landingDateTime,
      landingAirport: flight.landingAirport,
      airplaneId: flight.airplaneId,
      passengers: [],
    };

    // Aplanar grupos ordenados en lista de pasajeros
    for (const passengers of sortedGroups) {
      flightData.passengers.push(...passengers);
    }
    return flightData;
  }

  /**
   * Obtiene asientos disponibles filtrados por tipo de asiento y avión
   * Excluye asientos ya ocupados por otros pasajeros
   */
  async getAvailableSeatsByType(airplaneId, seatTypeId, passengers) {
    const airplaneSeats = await this.getAirplaneSeats(airplaneId);
    const seatIdsByType = airplaneSeats
      .filter((seat) => seat.seatTypeId === seatTypeId)
      .map(({ seatId }) => seatId);

    const reservedSeatIds = this.getReservedSeatIds(passengers);
    const availableSeatsByType = seatIdsByType.filter(
      (seatId) => !reservedSeatIds.includes(seatId)
    );
    return availableSeatsByType;
  }

  /**
   * Obtiene todos los asientos de un avión ordenados por fila
   */
  async getAirplaneSeats(airplaneId) {
    return await Seat.findAll({
      where: { airplaneId },
      order: [['seat_row', 'ASC'], ['seat_id', 'ASC']],
    });
  }

  /**
   * Extrae los IDs de asientos que ya están ocupados por pasajeros
   */
  getReservedSeatIds = (passengers) => {
    const reservedSeatIds = passengers
      .filter(p => p.seatId !== null && p.seatId !== undefined)
      .map(p => p.seatId);
    return reservedSeatIds;
  }

  /**
   * Encuentra el asiento de la derecha (columna siguiente) para sentar acompañantes
   * Busca en la misma fila y tipo de asiento
   */
  getRightSeatId(seatId, seats) {
    const seat = seats.find(s => s.seatId === seatId);
    if (!seat) return null;

    const col = seat.seatColumn;
    const row = seat.seatRow;
    const type = seat.seatTypeId;
    const nextCol = String.fromCharCode(col.charCodeAt(0) + 1); // Incrementa la columna (A -> B, B -> C, etc.)

    const rightSeat = seats.find(s => s.seatRow === row && s.seatColumn === nextCol && s.seatTypeId === type);

    // Retorna el ID del asiento de la derecha o null si no existe (el pasillo o extremos)
    return rightSeat ? rightSeat.seatId : null;
  }
}