import { observable, action, toJS, computed } from "mobx";
import * as yup from "yup";
import set from "lodash/set";
import get from "lodash/get";
import merge from "lodash/merge";

import {
  Values,
  Errors,
  DeepPartial,
  FormModel,
  Config,
  OnChangeEvent,
  OnSubmitEvent,
  ValidationFail,
  ValidationPass
} from "./types";

import { prepareDataForValidation, yupToErrors } from "./utils";

export default class FormStore<V extends Values> {
  @observable errors: Errors<V> = {};
  @observable values: FormModel<Required<V>>;

  constructor(private config: Config<V>) {
    this.values = config.initialValues;

    this.validate();

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setValue(path: string, value: any): void {
    // eslint-disable-next-line @typescript-eslint/ban-types
    set(this.values as {}, path, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue(path: string): any {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return get(this.values as {}, path);
  }

  getError(path: string): string | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return get(this.errors as {}, path);
  }

  isError(path: string): boolean {
    return this.getError(path) !== undefined;
  }

  @computed get isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @action change(path: string, value: unknown): void {
    if (get(this.values, path) === undefined) {
      throw new Error(`Invalid path "${path}"`);
    }

    this.setValue(path, value);
    this.validate();
  }

  @action update(values: DeepPartial<V>): void {
    merge(this.values, values);
    this.validate();
  }

  @action reset(): void {
    this.update(this.config.initialValues);
  }

  @action push(path: string, value: unknown): void {
    const item = get(this.values, path).slice();

    if(!Array.isArray(item)) {
      throw new Error(`Path "${path}" does not contain an array`);
    }

    item.push(value);
    this.setValue(path, item);
    this.validate();
  }

  @action remove(path: string, index: number): void {
    const item = get(this.values, path).slice();

    if(!Array.isArray(item)) {
      throw new Error(`Path "${path}" does not contain an array`);
    }

    item.splice(index, 1);
    this.setValue(path, item);
    this.validate();
  }

  @action validate(): ValidationPass<V> | ValidationFail<V> {
    const preparedValues = prepareDataForValidation(this.values);

    if (this.config.validationSchema) {
      try {
        const value = this.config.validationSchema.validateSync(preparedValues, {
          abortEarly: false
        });
        this.errors = {};

        return {
          result: true,
          values: value as V,
        }
      }
      catch(e) {
        const err: yup.ValidationError = e;

        if (err.name === "ValidationError") {
          this.errors = yupToErrors(err);
        }

        return {
          result: false,
          errors: this.errors,
        };
      }
    }

    return {
      result: true,
      values: preparedValues as V,
    }
  }

  @action onChange(e: OnChangeEvent): void {
    const { name, value, type } = e.target;
    const val = type === "number" && value !== "" ? parseFloat(value) : value;

    try {
      this.change(name, val);
    }
    catch(e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  @action onSubmit(e: OnSubmitEvent): void {
    e.preventDefault();

    const validateData = this.validate();

    if(validateData.result){
      this.config.onSubmit(toJS(validateData.values));
    }
  }

  @action onReset(): void {
    this.reset();
  }
}
