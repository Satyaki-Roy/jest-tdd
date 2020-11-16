import { beforeEach, describe, jest, test } from "@jest/globals";
import Model from "./model";

test("new works", () => {
  expect(new Model()).toBeInstanceOf(Model);
});

test("model structure", () => {
  expect(new Model()).toEqual(
    expect.objectContaining({
      $collection: expect.any(Array),
      record: expect.any(Function),
      all: expect.any(Function),
      find: expect.any(Function),
      update: expect.any(Function),
    })
  );
});

describe("record", () => {
  const heroes = [{ id: 1, name: "Batman" }, { name: "Spiderman" }];

  test("can add data to the collection", () => {
    const model = new Model();
    model.record(heroes);
    expect(model.$collection).toEqual([
      heroes[0],
      {
        id: expect.any(Number),
        name: "Spiderman",
      },
    ]);
  });

  test("get called when data is passed to Model", () => {
    const spy = jest.spyOn(Model.prototype, "record");
    const model = new Model(heroes);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("all", () => {
  const heroes = [
    { id: 1, name: "Batman" },
    { id: 2, name: "Spiderman" },
  ];

  test("returns empty collection", () => {
    const model = new Model();
    expect(model.all()).toEqual([]);
  });

  test("returns model data", () => {
    const model = new Model(heroes);
    expect(model.all()).toEqual(heroes);
  });

  test("original data stays intact", () => {
    const model = new Model(heroes);
    const data = model.all();
    data[0].name = "Joker";
    expect(model.$collection[0].name).toBe("Batman");
  });
});

describe("find", () => {
  const heroes = [
    { id: 1, name: "Batman" },
    { id: 2, name: "Spiderman" },
  ];

  test("id not found", () => {
    const model = new Model();
    expect(model.find(1)).toEqual(null);
  });

  test("id found", () => {
    const model = new Model(heroes);
    expect(model.find(1)).toEqual(heroes[0]);
  });
});

describe("update", () => {
  const heroes = [
    { id: 1, name: "Batman" },
    { id: 2, name: "Spiderman" },
  ];

  let model;

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroes));
    model = new Model(dataset);
  });

  test("an entry by id", () => {
    expect(model.update(1, { name: "Joker" })).toEqual(
      expect.objectContaining({
        id: 1,
        name: "Joker",
      })
    );
  });

  test("extend an entry by id", () => {
    expect(model.update(1, { fly: true })).toEqual(
      expect.objectContaining({
        id: 1,
        name: "Batman",
        fly: true,
      })
    );
  });

  test("returns false if no entry matches", () => {
    expect(model.update(3, { fly: true })).toEqual(false);
  });
});
