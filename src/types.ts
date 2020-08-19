import * as yup from "yup";

export interface Config<V> {
  onSubmit: (data: V) => void;
  initialValues: FormModel<Required<V>>;
  validationSchema?: yup.ObjectSchema;
}

export interface OnChangeEvent {
  target: {
    name: string;
    value: string;
    type?: string;
  };
}

export interface OnSubmitEvent {
  preventDefault: () => void;
}


export type FormModel<T extends Values> = {
  [K in keyof T]: T[K] extends number
    ? number | ""
    // eslint-disable-next-line @typescript-eslint/ban-types
    : T[K] extends object
      ? FormModel<T[K]>
      : T[K]
}

export interface Values {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Get from Formik - https://github.com/formium/formik/blob/master/packages/formik/src/types.tsx#L13
export type Errors<V> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof V]?: V[K] extends any[]
    // eslint-disable-next-line @typescript-eslint/ban-types
    ? V[K][number] extends object
      ? Errors<V[K][number]>[] | string | string[]
      : string | string[]
    // eslint-disable-next-line @typescript-eslint/ban-types
    : V[K] extends object
      ? Errors<V[K]>
      : string;
};

export type ValidationPass<V> = {
  result: true;
  values: V;
}
export type ValidationFail<V> = {
  result: false;
  errors: Errors<V>;
}
