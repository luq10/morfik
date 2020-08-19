import { prepareDataForValidation } from "./utils";

describe("utils", () => {
  describe("prepareDataForValidation", () => {
    it("should replace empty string to undefined | object", () => {
      const data = prepareDataForValidation({
        name: "John",
        surname: ""
      });

      expect(data).toEqual({
        name: "John",
        surname: undefined,
      });
    });

    it("should replace empty string to undefined | deep object", () => {
      const data = prepareDataForValidation({
        person: {
          name: "John",
          surname: ""
        },
        a: {
          b: {
            c: ""
          }
        }
      });

      expect(data).toEqual({
        person: {
          name: "John",
          surname: undefined
        },
        a: {
          b: {
            c: undefined
          }
        }
      });
    });

    it("should replace empty string to undefined | object > array > object", () => {
      const data = prepareDataForValidation({
        points: [
          { x: "", y: "" },
          { x: 3, y: "" }
        ],
      });

      expect(data).toEqual({
        points: [
          { x: undefined, y: undefined },
          { x: 3, y: undefined }
        ],
      });
    });

    it("should remove empty string | object > array", () => {
      const data = prepareDataForValidation({
        data: ["Some", "", "Else"],
        data2: [""]
      });

      expect(data).toEqual({
        data: ["Some", "Else"],
        data2: []
      });
    });

    it("should remove empty string | array", () => {
      const data = prepareDataForValidation(["Some", "", "Else"]);

      expect(data).toEqual(["Some", "Else"]);
    });
  })
});
