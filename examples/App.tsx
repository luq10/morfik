import React from "react";
import { observer } from "mobx-react";

import stores from "./stores";

import "./style.css";

const App: React.FC = observer(() => {
  const store = stores.app;

  function onDefault(): void {
    store.form.update({
      name: "John",
      surname: "Doe"
    });

    // The same as:
    //
    // store.form.change("name", "John");
    // store.form.change("surname", "Doe");
  }

  return (
    <div>
      <h1>Form 1</h1>

      <form onSubmit={store.form.onSubmit} onReset={store.form.onReset}>
        <div className="form-group">
          <label>name: </label>
          <input
            type="text"
            name="name"
            value={store.form.values.name}
            onChange={store.form.onChange}
          />
        </div>
        <div className="form-group">
          <label>surname: </label>
          <input
            type="text"
            name="surname"
            value={store.form.values.surname}
            onChange={store.form.onChange}
          />
          <button type="button" onClick={onDefault}>Default person</button>
        </div>
        <div className="form-group">
          <label>age: </label>
          <input
            type="number"
            name="age"
            step="0.01"
            value={store.form.values.age}
            onChange={store.form.onChange}
          />
        </div>
        <div className="form-group">
          <label>id: </label>
          <input
            type="number"
            name="id"
            value={store.form.values.id}
            onChange={store.form.onChange}
          />
        </div>

        <button type="reset">Reset</button>
        <button type="submit" disabled={!store.form.isValid}>Submit</button>

        <pre>
          {JSON.stringify({
            values: store.form.values,
            errors: store.form.errors,
            isValid: store.form.isValid,
          }, null, 2)}
        </pre>
      </form>

      <hr/>
      <h1>Form 2</h1>

      <form onSubmit={store.form2.onSubmit}>
        <div className="form-group">
          <label>a: </label>
          <input
            type="text"
            name="a"
            value={store.form2.values.a}
            onChange={store.form2.onChange}
          />
        </div>
        <div className="form-group">
          <label>b: </label>
          <input
            type="text"
            name="b"
            value={store.form2.values.b}
            onChange={store.form2.onChange}
          />
        </div>

        <button type="submit" disabled={!store.form2.isValid}>Submit</button>

        <pre>
          {JSON.stringify({
            values: store.form2.values,
            errors: store.form2.errors,
            isValid: store.form2.isValid,
          }, null, 2)}
        </pre>
      </form>

      <hr/>
      <h1>Form 3</h1>

      <form onSubmit={store.form3.onSubmit}>
        <div className="form-group">
          <label>person.name: </label>
          <input
            type="text"
            name="person.name"
            value={store.form3.values.person.name}
            onChange={store.form3.onChange}
          />
        </div>
        <div className="form-group">
          <label>person.surname: </label>
          <input
            type="text"
            name="person.surname"
            value={store.form3.values.person.surname}
            onChange={store.form3.onChange}
          />
        </div>
        <div className="form-group">
          <label>a.b.c: </label>
          <input
            type="number"
            name="a.b.c"
            value={store.form3.values.a.b.c}
            onChange={store.form3.onChange}
          />
          <button onClick={() => {
            store.form3.update({
              a: {
                b: {
                  c: 3
                }
              },
              person: {
                name: "Foo",
              }
            })
          }}>Set values</button>
        </div>

        {
          store.form3.values.a.data.map((item, index) => {
            return (
              <div className="form-group" key={index}>
                <label>a.data[{index}]: </label>
                <input
                  type="number"
                  name={`a.data[${index}].x`}
                  value={store.form3.values.a.data[index].x}
                  onChange={store.form3.onChange}
                />
                <input
                  type="number"
                  name={`a.data[${index}].y`}
                  value={store.form3.values.a.data[index].y}
                  onChange={store.form3.onChange}
                />

                {
                  store.form3.isError(`a.data[${index}]`) &&
                  <pre>
                    errors:
                    {JSON.stringify({
                      x: store.form3.getError(`a.data[${index}].x`),
                      y: store.form3.getError(`a.data[${index}].y`),
                    }, null, 2)}
                  </pre>
                }
              </div>
            );
          })
        }
        <button type="button" onClick={() => store.form3.push(`a.data`, {x: "", y: ""})}>Next data element</button>
        <button type="submit" disabled={!store.form3.isValid}>Submit</button>

        <pre>
          {JSON.stringify({
            values: store.form3.values,
            errors: store.form3.errors,
            isValid: store.form3.isValid,
          }, null, 2)}
        </pre>
      </form>
    </div>
  );
});

export default App;
