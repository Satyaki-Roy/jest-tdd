export default class Model {
  constructor(data = []) {
    this.$collection = [];

    if (data.length) {
      this.record(data);
    }
  }

  record(data) {
    const primaryKey = "id";
    // deep copy of data array and each object element
    const entry = data.map((entry) => Object.assign({}, entry));
    // checking if id is present or not and adding a id if it doesn't exists
    const entryWithIds = entry.map((element) => {
      if (element[primaryKey]) {
        return element;
      }
      element[primaryKey] = Date.now();
      return element;
    });
    // pushing the data to collection
    this.$collection.push(...entryWithIds);
  }

  all() {
    return this.$collection.map((entry) => Object.assign({}, entry));
  }

  find(id) {
    const primaryKey = "id";
    const entry = this.$collection.find((entry) => entry[primaryKey] === id);
    return entry ? Object.assign({}, entry) : null;
  }

  update() {}
}
