import dayjs from "dayjs";

const apiDataFormats = ["YYYY-MM-DD", "DD-MM-YYYY"];

export class Model {
  map = {};

  setData(data) {
    for (const [key, value] of Object.entries(this.map)) {
      this[key] = this.SetObjectValue(this.map[key].type, data[value.key]);
    }
  }

  getData() {
    return this.data;
  }

  SetObjectValue(type, value) {
    switch (type) {
      case "string_secure":
      case "string":
        return value;
      case "int":
        return parseInt(value);
      case "date":
        return dayjs(value, apiDataFormats);
      case "date_nullable":
        const date = dayjs(value, apiDataFormats);
        if (date.isValid()) {
          return date;
        } else {
          return null;
        }
      case "date_detail":
        return dayjs(value);
      case "object":
        return { value };
      case "boolean":
        return value;
    }
  }
}
