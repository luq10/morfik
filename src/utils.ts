import * as yup from "yup";
import setWith from "lodash/setWith";
import isPlainObject from "lodash/isPlainObject";

import { Errors, Values } from "./types";

function filterArrayForValidation(value: unknown[]): boolean {
  return (Array.isArray(value) || isPlainObject(value))
    ? true
    : value !== "";
}

/**
 * Formik implementation:
 *
 * Main change: Arrays is represented as object
 *
 * See: https://github.com/formium/formik/blob/master/packages/formik/src/Formik.tsx#L1060
 */
export function yupToErrors<V extends Values>(yupError: yup.ValidationError): Errors<V> {
  return yupError.inner.reduce<Errors<V>>((acc, item) => {
    setWith(acc, item.path, item.message, Object);
    return acc;
  }, {});
}

/**
 * Based on formik
 *
 * Main change: In this implementation each empty string is removed from array
 *
 * See: https://github.com/formium/formik/blob/v2.1.5/packages/formik/src/Formik.tsx#L1094
 */
export function prepareDataForValidation<T extends Values>(values: T): Values {
  const data: Values = Array.isArray(values) ? [] : {};

  if(Array.isArray(values)) {
    values = (values as T).filter(filterArrayForValidation)
  }

  for (const k in values) {
    if (Object.prototype.hasOwnProperty.call(values, k)) {
      const key = String(k);

      if(Array.isArray(values[key])) {
        // Array
        data[key] = values[key]
          .filter(filterArrayForValidation)
          .map((value: T) => {
            return (Array.isArray(value) || isPlainObject(value))
              ? prepareDataForValidation(value)
              : value;
          })
      }
      else if(isPlainObject(values[key])) {
        // Object
        data[key] = prepareDataForValidation(values[key]);
      }
      else {
        // Primitive
        data[key] = values[key] !== "" ? values[key] : undefined;
      }
    }
  }

  return data;
}
