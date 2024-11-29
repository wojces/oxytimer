import { Model } from "./model";

export class User extends Model {
  constructor(data) {
    super();
    this.setData(data);
  }

  map = {
    idUser: { key: "id_user", type: "int" },
    email: { key: "email", type: "string" },
    firstName: { key: "first_name", type: "string" },
    lastName: { key: "last_name", type: "string" },
    createdAt: { key: "created_at", type: "date" },
  };
}
