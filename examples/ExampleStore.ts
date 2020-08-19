import { observable, action } from "mobx";
import * as yup from "yup";

import FormStore from "../src/FormStore";

interface FormData {
  name: string;
  surname: string;
  age: number;
  id?: number;
}

interface FormData2 {
  a?: string;
  b?: string;
}

interface FormData3 {
  person: {
    name: string;
    surname: string;
  }
  a: {
    b: {
      c: number
    },
    data: Array<{ x: number, y: number }>
  }
}

export default class ExampleStore {
  @observable form = new FormStore({
    initialValues: {
      name: "",
      surname: "default",
      age: "",
      id: "",
    },
    onSubmit: this.onSubmit,
    validationSchema: yup.object({
      name: yup.string().required(),
      surname: yup.string().required(),
      age: yup.number().positive().integer().required(),
      id: yup.number().integer(),
    })
  });

  @observable form2 = new FormStore({
    initialValues: {
      a: "",
      b: "",
    },
    onSubmit: this.onSubmit2.bind(this)
  });

  @observable form3 = new FormStore({
    initialValues: {
      person: {
        name: "",
        surname: ""
      },
      a: {
        b: {
          c: ""
        },
        data: [{ x: 1, y: 2 }]
      },
    },
    validationSchema: yup.object({
      person: yup.object({
        name: yup.string().required(),
        surname: yup.string().required(),
      }),
      a: yup.object({
        b: yup.object({
          c: yup.number()
            .min(100, ({min, path}) => `${path} less then min: ${min}`)
            .max(200, ({max, path}) => `${path} more then max: ${max}`)
        }),
        data: yup.array().of(yup.object({
          x: yup.number().min(1).max(10).required(),
          y: yup.number().min(1).max(10).required(),
        }))
      })
    }),
    onSubmit: this.onSubmit3.bind(this)
  });

  @action onSubmit(data: FormData) {
    console.log("Submit form1", data);
  }

  @action onSubmit2(data: FormData2) {
    console.log("Submit form2", data);
  }

  @action onSubmit3(data: FormData3) {
    console.log("Submit form3", data);
  }
}
