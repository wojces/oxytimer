import { Model } from "./model";

export class Rescuer extends Model {
  constructor(data) {
    super();
    this.setData(data);
  }

  map = {
    idRescuer: { key: "id_rescuer", type: "int" },
    firstName: { key: "first_name", type: "string" },
    lastName: { key: "last_name", type: "string" },
    location: { key: "location", type: "string" },
    unit: { key: "unit", type: "string" },
    commanderFirstName: { key: "commander_first_name", type: "string" },
    commanderLastName: { key: "commander_last_name", type: "string" },
    inPressure: { key: "in_pressure", type: "int" },
    createdAt: { key: "created_at", type: "date" },
  };
}
