import * as yup from "yup";

import FormStore from "./FormStore";
import { ValidationPass, ValidationFail } from "./types";

describe("FormStore", () => {
  describe("initialValues", () => {
    it("should initialize with values based on initialValues", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      expect(form.values).toEqual({
        name: "John",
        surname: "Doe",
      });
    });

    it("numbers type can be set in initialValues as empty string", () => {
      interface FormData {
        number: number;
      }

      const form = new FormStore<FormData>({
        initialValues: {
          // Important!
          //
          // only "" is valid. Any other string value will return TypeScript error
          number: "",
        },
        onSubmit: jest.fn()
      });

      expect(form.values).toEqual({
        number: "",
      });
    });

    it("numbers type can be set in initialValues as number", () => {
      interface FormData {
        number: number;
      }

      const form = new FormStore<FormData>({
        initialValues: {
          number: 3,
        },
        onSubmit: jest.fn()
      });

      expect(form.values).toEqual({
        number: 3,
      });
    });
  });

  describe("change()", () => {
    it("should update simple values", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      form.change("name", "Adam");
      form.change("surname", "Smith");

      expect(form.values).toEqual({
        name: "Adam",
        surname: "Smith",
      });
    });

    it("should update deep values", () => {
      const form = new FormStore({
        initialValues: {
          person: {
            name: "John",
            surname: "Doe",
          }
        },
        onSubmit: jest.fn()
      });

      form.change("person.name", "Adam");
      form.change("person.surname", "Smith");

      expect(form.values).toEqual({
        person: {
          name: "Adam",
          surname: "Smith",
        }
      });
    });

    it("should throw error when pass not valid path", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      expect(() => {
        form.change("NOT_EXISTS", "value")
      }).toThrowError("Invalid path \"NOT_EXISTS\"");
    });
  });

  describe("update()", () => {
    it("should update simple values", () => {
      interface FormData {
        name: string,
        surname: string,
      }

      const form = new FormStore<FormData>({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      form.update({
        name: "Adam",
        surname: "Smith"
      });

      expect(form.values).toEqual({
        name: "Adam",
        surname: "Smith",
      });
    });

    it("should update deep values", () => {
      interface FormData {
        person: {
          name: string,
          surname: string,
        }
      }

      const form = new FormStore<FormData>({
        initialValues: {
          person: {
            name: "John",
            surname: "Doe",
          }
        },
        onSubmit: jest.fn()
      });

      form.update({
        person: {
          name: "Adam",
          surname: "Smith",
        }
      });

      expect(form.values).toEqual({
        person: {
          name: "Adam",
          surname: "Smith",
        }
      });
    });

    it("should update deep values as merge", () => {
      interface FormData {
        person: {
          name: string,
          surname: string,
        }
      }

      const form = new FormStore<FormData>({
        initialValues: {
          person: {
            name: "John",
            surname: "Doe",
          }
        },
        onSubmit: jest.fn()
      });

      form.update({
        person: {
          name: "Adam",
        }
      });

      expect(form.values).toEqual({
        person: {
          name: "Adam",
          surname: "Doe",
        }
      });
    });
  });

  describe("getValue()", () => {
    const form = new FormStore({
      initialValues: {
        person: {
          name: "John"
        }
      },
      onSubmit: jest.fn()
    });

    expect(form.getValue("person.name")).toBe("John");
  });

  describe("reset()", () => {
    it("should reset values to initialValues", () => {
      interface FormData {
        name: string,
        surname: string,
      }

      const form = new FormStore<FormData>({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      form.update({
        name: "",
        surname: "Smith"
      });
      form.reset();

      expect(form.values).toEqual({
        name: "John",
        surname: "Doe",
      });
    })
  });

  describe("push()", () => {
    it("should push new element to array in values", () => {
      interface FormData {
        elements: {
          data: Array<{x: number, y: number}>
        }
      }

      const form = new FormStore<FormData>({
        initialValues: {
          elements: {
            data: []
          }
        },
        onSubmit: jest.fn()
      });

      expect(form.values).toEqual({
        elements: {
          data: []
        }
      });

      form.push("elements.data", { x: 0, y: 1 });

      expect(form.values).toEqual({
        elements: {
          data: [
            { x: 0, y: 1 }
          ]
        }
      });
    })

    it("should throw error when try to push to non-array path", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      expect(() => {
        form.push("name", {x: 0, y: 1})
      }).toThrowError("Path \"name\" does not contain an array");
    })
  });

  describe("remove()", () => {
    it("should remove element on array in values", () => {
      interface FormData {
        elements: {
          data: Array<{x: number, y: number}>
        }
      }

      const form = new FormStore<FormData>({
        initialValues: {
          elements: {
            data: [
              {x: 1, y: 1},
              {x: 2, y: 2},
              {x: 3, y: 3},
            ]
          }
        },
        onSubmit: jest.fn()
      });

      expect(form.values).toEqual({
        elements: {
          data: [
            {x: 1, y: 1},
            {x: 2, y: 2},
            {x: 3, y: 3},
          ]
        }
      });

      form.remove("elements.data", 1);

      expect(form.values).toEqual({
        elements: {
          data: [
            {x: 1, y: 1},
            {x: 3, y: 3},
          ]
        }
      });
    })

    it("should throw error when try to remove on non-array path", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      expect(() => {
        form.remove("name", 1)
      }).toThrowError("Path \"name\" does not contain an array");
    })
  });

  describe("onChange()", () => {
    it("should update values", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      form.onChange({
        target: {
          name: "surname",
          value: "Smith",
        }
      });

      expect(form.values).toEqual({
        name: "John",
        surname: "Smith",
      });
    });

    it("should parse numbers", () => {
      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
          age: ""
        },
        onSubmit: jest.fn()
      });

      form.onChange({
        target: {
          name: "age",
          value: "20",
          type: "number",
        }
      });

      expect(form.values).toEqual({
        name: "John",
        surname: "Doe",
        age: 20,
      });
    });
  });

  describe("onSubmit()", () => {
    it("should call e.preventDefault()", () => {
      const onSubmit = jest.fn();
      const preventDefault = jest.fn();

      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit,
      });

      form.onSubmit({
        preventDefault
      });

      expect(preventDefault).toHaveBeenCalled();
    });

    it("should call onSubmit when is no validationSchema", () => {
      const onSubmit = jest.fn();
      const preventDefault = jest.fn();

      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit,
      });

      form.onSubmit({
        preventDefault
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: "John",
        surname: "Doe"
      });
    });

    it("should call onSubmit when is validationSchema and valid", () => {
      const onSubmit = jest.fn();
      const preventDefault = jest.fn();

      const form = new FormStore({
        initialValues: {
          name: "Adam",
          surname: "Smith",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().min(5).required(),
        }),
        onSubmit,
      });

      form.onSubmit({
        preventDefault
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: "Adam",
        surname: "Smith"
      });
    });

    it("should't call onSubmit when is validationSchema and invalid", () => {
      const onSubmit = jest.fn();
      const preventDefault = jest.fn();

      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().min(5).required(),
        }),
        onSubmit,
      });

      form.onSubmit({
        preventDefault
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("#1", () => {
      const onSubmit = jest.fn();
      const preventDefault = jest.fn();

      const form = new FormStore({
        initialValues: {
          name: "John",
          surname: "Doe",
          age: 20,
          id: "",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().required(),
          age: yup.number().positive().integer().required(),
          id: yup.number().integer(),
        }),
        onSubmit,
      });

      form.onSubmit({
        preventDefault
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: "John",
        surname: "Doe",
        age: 20,
        id: undefined
      });
    });
  });

  describe("onReset()", () => {
    it("should reset values to initialValues", () => {
      interface FormData {
        name: string,
        surname: string,
      }

      const form = new FormStore<FormData>({
        initialValues: {
          name: "John",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      form.update({
        name: "",
        surname: "Smith"
      });
      form.onReset();

      expect(form.values).toEqual({
        name: "John",
        surname: "Doe",
      });
    })
  });

  /**
   * No validation
   */
  describe("No validation", () => {
    it("should initialize with no errors", () => {
      const form = new FormStore({
        initialValues: {
          name: "",
          surname: "Doe",
        },
        onSubmit: jest.fn()
      });

      expect(form.errors).toEqual({});
      expect(form.isValid).toBe(true);
    });

    describe("validate()", () => {
      it("should pass with undefined instead empty string", () => {
        interface FormData {
          name: string,
          surname: string,
          companyName?: string;
        }

        const form = new FormStore({
          initialValues: {
            name: "Adam",
            surname: "Smith",
            companyName: "",
          },
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationPass<FormData>;

        if(validate.result) {
          expect(validate.result).toBe(true);
          expect(validate.values).toEqual({
            name: "Adam",
            surname: "Smith",
            companyName: undefined, // TODO ?
          });
        }
      });
    })
  });

  /**
   * Yup validation
   */
  describe("Yup validation", () => {
    it("should initialize with errors", () => {
      const form = new FormStore({
        initialValues: {
          name: "",
          surname: "Doe",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().min(5).required(),
        }),
        onSubmit: jest.fn()
      });

      expect(form.errors).toEqual({
        name: "name is a required field",
        surname: "surname must be at least 5 characters",
      });
      expect(form.isValid).toBe(false);
    });

    it("should initialize with no errors", () => {
      const form = new FormStore({
        initialValues: {
          name: "Adam",
          surname: "Smith",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().min(5).required(),
        }),
        onSubmit: jest.fn()
      });

      expect(form.errors).toEqual({})
      expect(form.isValid).toBe(true);
    });

    it("change() should run validation", () => {
      interface FormData {
        name: string,
        surname: string,
      }

      const form = new FormStore<FormData>({
        initialValues: {
          name: "",
          surname: "Doe",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().min(5).required(),
        }),
        onSubmit: jest.fn()
      });

      expect(form.errors).toEqual({
        name: "name is a required field",
        surname: "surname must be at least 5 characters",
      });
      expect(form.isValid).toBe(false);

      form.change("name", "Adam");

      expect(form.errors).toEqual({
        surname: "surname must be at least 5 characters",
      });
      expect(form.isValid).toBe(false);

      form.change("surname", "Smith");

      expect(form.errors).toEqual({});
      expect(form.isValid).toBe(true);
    });

    it("update() should run validation", () => {
      interface FormData {
        name: string,
        surname: string,
      }

      const form = new FormStore<FormData>({
        initialValues: {
          name: "",
          surname: "Doe",
        },
        validationSchema: yup.object({
          name: yup.string().required(),
          surname: yup.string().min(5).required(),
        }),
        onSubmit: jest.fn()
      });

      expect(form.errors).toEqual({
        name: "name is a required field",
        surname: "surname must be at least 5 characters",
      });
      expect(form.isValid).toBe(false);

      form.update({
        name: "Adam",
        surname: "Smith"
      });

      expect(form.errors).toEqual({});
      expect(form.isValid).toBe(true);
    });

    it("push() should run validation", () => {
      interface FormData {
        elements: {
          data: Array<{x: number, y: number}>
        }
      }

      const form = new FormStore<FormData>({
        initialValues: {
          elements: {
            data: []
          }
        },
        validationSchema: yup.object({
          elements: yup.object({
            data: yup.array().of(yup.object({
              x: yup.number().required(),
              y: yup.number().required(),
            }))
          })
        }),
        onSubmit: jest.fn()
      });

      expect(form.isValid).toBe(true);

      form.push("elements.data", { x: "", y: "" });

      expect(form.errors).toEqual({
        elements: {
          data: {
            "0": {
              x: "elements.data[0].x is a required field",
              y: "elements.data[0].y is a required field",
            }
          }
        }
      });
      expect(form.isValid).toBe(false);
    });

    describe("validate()", () => {
      it("should fail", () => {
        interface FormData {
          name: string,
          surname: string,
        }

        const form = new FormStore({
          initialValues: {
            name: "",
            surname: "Doe",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
          }),
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationFail<FormData>;

        expect(validate.result).toBe(false);
        expect(validate.errors).toEqual({
          name: "name is a required field",
          surname: "surname must be at least 5 characters",
        });
      });

      it("should pass", () => {
        interface FormData {
          name: string,
          surname: string,
        }

        const form = new FormStore({
          initialValues: {
            name: "Adam",
            surname: "Smith",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
          }),
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationPass<FormData>;

        if(validate.result) {
          expect(validate.result).toBe(true);
          expect(validate.values).toEqual({
            name: "Adam",
            surname: "Smith",
          });
        }
      });

      it("should pass with undefined instead empty string", () => {
        interface FormData {
          name: string,
          surname: string,
          companyName?: string;
        }

        const form = new FormStore({
          initialValues: {
            name: "Adam",
            surname: "Smith",
            companyName: "",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
            companyName: yup.string(),
          }),
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationPass<FormData>;

        if(validate.result) {
          expect(validate.result).toBe(true);
          expect(validate.values).toEqual({
            name: "Adam",
            surname: "Smith",
            companyName: undefined, // TODO ?
          });
        }
      });

      it("should pass with undefined instead empty string in deep path", () => {
        interface FormData {
          name: string;
          surname: string;
          a: {
            b: {
              c?: string;
            }
          };
        }

        const form = new FormStore({
          initialValues: {
            name: "Adam",
            surname: "Smith",
            a: {
              b: {
                c: ""
              }
            }
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
            a: yup.object({
              b: yup.object({
                c: yup.string(),
              })
            })
          }),
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationPass<FormData>;

        if(validate.result) {
          expect(validate.result).toBe(true);
          expect(validate.values).toEqual({
            name: "Adam",
            surname: "Smith",
            a: {
              b: {
                c: undefined // TODO ?
              }
            },
          });
        }
      });

      it("should pass with undefined instead empty string in array", () => {
        interface FormData {
          name: string,
          surname: string,
          companyNames?: string[];
        }

        const form = new FormStore<FormData>({
          initialValues: {
            name: "Adam",
            surname: "Smith",
            companyNames: ["Google", ""],
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
            companyNames: yup.array().of(yup.string())
          }),
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationPass<FormData>;

        if(validate.result) {
          expect(validate.result).toBe(true);
          expect(validate.values).toEqual({
            name: "Adam",
            surname: "Smith",
            companyNames: ["Google"],
          });
        }
      });
      
      it("should fail when is empty string in required field", () => {
        interface FormData {
          points: Array<{ x: number; y: number }>,
        }

        const form = new FormStore<FormData>({
          initialValues: {
            points: [
              { x: "", y: "" },
              { x: 3, y: "" }
            ],
          },
          validationSchema: yup.object({
            points: yup.array().of(yup.object({
              x: yup.number().required(),
              y: yup.number().required(),
            }))
          }),
          onSubmit: jest.fn()
        });

        const validate = form.validate() as ValidationFail<FormData>;

        if(validate.result) {
          expect(validate.result).toBe(false);
          expect(validate.errors).toEqual({
            "0": {
              x: "points[0].x is a required field",
              y: "points[0].y is a required field"
            },
            "1": { 
              y: "points[1].y is a required field" 
            }
          });
        }
      });
    });

    describe("isError()", () => {
      it("should return true is error in path exist", () => {
        const form = new FormStore({
          initialValues: {
            name: "",
            surname: "Doe",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
          }),
          onSubmit: jest.fn()
        });

        expect(form.isError("name")).toBe(true);
      });

      it("should return false is error in path don't exist", () => {
        const form = new FormStore({
          initialValues: {
            name: "John",
            surname: "Doe",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
          }),
          onSubmit: jest.fn()
        });

        expect(form.isError("name")).toBe(false);
      });

      it("should return true is error in deep path exist", () => {
        const form = new FormStore({
          initialValues: {
            a: {
              b: {
                c: ""
              }
            }
          },
          validationSchema: yup.object({
            a: yup.object({
              b: yup.object({
                c: yup.string().required(),
              })
            })
          }),
          onSubmit: jest.fn()
        });

        expect(form.isError("a.b.c")).toBe(true);
      });

      it("should return true is error in deep array path exist", () => {
        const form = new FormStore({
          initialValues: {
            a: {
              b: {
                c: [
                  {x: 1, y: 2},
                  {x: 3, y: 4},
                  {x: 100, y: 200},
                  {x: 5, y: 6},
                ]
              }
            }
          },
          validationSchema: yup.object({
            a: yup.object({
              b: yup.object({
                c: yup.array().of(yup.object({
                  x: yup.number().min(0).max(10),
                  y: yup.number().min(0).max(10),
                })),
              })
            })
          }),
          onSubmit: jest.fn()
        });

        expect(form.isError("a.b.c[0]")).toBe(false);
        expect(form.isError("a.b.c[1]")).toBe(false);
        expect(form.isError("a.b.c[2]")).toBe(true);
        expect(form.isError("a.b.c[3]")).toBe(false);
      });
    });

    describe("getError()", () => {
      it("should return message is error in path exist", () => {
        const form = new FormStore({
          initialValues: {
            name: "",
            surname: "Doe",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
          }),
          onSubmit: jest.fn()
        });

        expect(form.getError("name")).toBe("name is a required field");
      });

      it("should return undefined is error in path don't exist", () => {
        const form = new FormStore({
          initialValues: {
            name: "John",
            surname: "Doe",
          },
          validationSchema: yup.object({
            name: yup.string().required(),
            surname: yup.string().min(5).required(),
          }),
          onSubmit: jest.fn()
        });

        expect(form.getError("name")).toBe(undefined);
      });

      it("should return message for error in deep path", () => {
        const form = new FormStore({
          initialValues: {
            a: {
              b: {
                c: ""
              }
            }
          },
          validationSchema: yup.object({
            a: yup.object({
              b: yup.object({
                c: yup.string().required(),
              })
            })
          }),
          onSubmit: jest.fn()
        });

        expect(form.getError("a.b.c")).toBe("a.b.c is a required field");
      });

      it("should return message for error in deep array path exist", () => {
        const form = new FormStore({
          initialValues: {
            a: {
              b: {
                c: [
                  {x: 1, y: 2},
                  {x: 3, y: 4},
                  {x: 100, y: 200},
                  {x: 5, y: 6},
                ]
              }
            }
          },
          validationSchema: yup.object({
            a: yup.object({
              b: yup.object({
                c: yup.array().of(yup.object({
                  x: yup.number().min(0).max(10),
                  y: yup.number().min(0).max(10),
                })),
              })
            })
          }),
          onSubmit: jest.fn()
        });

        const xError = "a.b.c[2].x must be less than or equal to 10";
        const yError = "a.b.c[2].y must be less than or equal to 10";

        expect(form.getError("a.b.c[2]")).toEqual({
          x: xError,
          y: yError,
        });
        expect(form.getError("a.b.c[2].x")).toBe(xError);
        expect(form.getError("a.b.c[2].y")).toBe(yError);
      });
    });
  });
});
