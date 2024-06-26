import { PassengerData } from "@/actions/db/passenger";
import { checkError } from "@/actions/util";
import { db } from "@/db";
import { passengerSchema, type FullPassenger, type Passenger } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const data = await PassengerData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Passenger with id ${id} not found`,
		});
	}
	data.setDatabase(db);
	return data;
}

export const passengerActions = {
	getAll: defineAction({
		handler: () =>
			checkError(async () => {
				const passengers = await PassengerData.getAll(db);
				return Promise.all(
					passengers.map<Promise<FullPassenger>>(async (passenger) => {
						passenger.setDatabase(db);
						const flights = await passenger.fetchFlights();
						return {
							...(instanceToPlain(passenger) as Passenger),
							flights,
						};
					}),
				);
			}),
	}),

	get: defineAction({
		accept: "json",
		input: passengerSchema.pick({ passenger_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.passenger_id);
				const flights = await data.fetchFlights();
				return {
					...(instanceToPlain(data) as Passenger),
					flights,
				} as FullPassenger;
			}),
	}),

	create: defineAction({
		accept: "json",
		input: passengerSchema.omit({ passenger_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = PassengerData.createHolder(db, input);
				await data.insert();
				return instanceToPlain(data) as Passenger;
			}),
	}),

	update: defineAction({
		accept: "json",
		input: passengerSchema.partial().required({ passenger_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.passenger_id);
				await data.update({
					first_name: input.first_name,
					last_name: input.last_name,
					address: input.address,
					phone: input.phone,
				});
				return instanceToPlain(data) as Passenger;
			}),
	}),

	delete: defineAction({
		accept: "json",
		input: passengerSchema.pick({ passenger_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.passenger_id);
				await data.delete();
				return instanceToPlain(data) as Passenger;
			}),
	}),
};
