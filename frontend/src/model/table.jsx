import { Model } from "./model";

export class MainTable extends Model {
  constructor(data) {
    super();
    this.setData(data);
  }

  map = {
    idTable: { key: "id_table", type: "int" },
    userId: { key: "user_creator_id", type: "int" },
    name: { key: "name", type: "string" },
    location: { key: "location", type: "string" },
    createdAt: { key: "created_at", type: "date" },
    finishedAt: { key: "finished_at", type: "date" },
    finished: { key: "finished", type: "int" },
  };
}
