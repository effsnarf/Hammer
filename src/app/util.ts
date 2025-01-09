import { useState } from "react";

const Objects = {
  // Mutable set: Modifies the original object directly
  set: (obj: any, path: (string | number)[], value: any): any => {
    let temp = obj;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        temp[key] = value;
      } else {
        // Handle arrays and objects
        if (!temp[key]) {
          temp[key] = Array.isArray(temp[key]) ? [] : {}; // Initialize if undefined
        }
        temp[key] = Array.isArray(temp[key])
          ? [...temp[key]]
          : { ...temp[key] };
      }
      temp = temp[key];
    });

    return obj; // Return the mutated object
  },

  // Immutable cloneSet: Returns a new object with updated path
  cloneSet: (obj: any, path: (string | number)[], value: any): any => {
    const clonedObj = Objects.clone(obj);
    let temp = clonedObj;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        temp[key] = value;
      } else {
        // Handle arrays and objects
        if (!temp[key]) {
          temp[key] = Array.isArray(temp[key]) ? [] : {}; // Initialize if undefined
        }
        temp[key] = Array.isArray(temp[key])
          ? [...temp[key]]
          : { ...temp[key] };
      }
      temp = temp[key];
    });

    return clonedObj; // Return the new cloned object
  },

  setReactive: (
    setState: React.Dispatch<React.SetStateAction<any>>,
    path: (string | number)[],
    value: any
  ): void => {
    // Update the state using the setState function
    setState((prevState: any) => {
      const updatedObj = { ...prevState };
      let temp = updatedObj;

      path.forEach((key, index) => {
        if (index === path.length - 1) {
          temp[key] = value;
        } else {
          // Handle arrays and objects
          if (!temp[key]) {
            temp[key] = Array.isArray(temp[key]) ? [] : {}; // Initialize if undefined
          }
          temp[key] = Array.isArray(temp[key])
            ? [...temp[key]]
            : { ...temp[key] };
        }
        temp = temp[key];
      });

      return updatedObj;
    });
  },

  clone: (obj: any): any => JSON.parse(JSON.stringify(obj)),
};

class ReactiveValue<T> {
  value: T;
  private _reactSet: any;

  private _watchers = [] as ((value: T) => void)[];
  private _blockConditions: (() => boolean)[] = [];

  private constructor(value: T) {
    const [rValue, rSet] = useState(value);
    this.value = rValue;
    this._reactSet = rSet;
  }

  static from<T>(value: T): ReactiveValue<T> {
    return new ReactiveValue(value);
  }

  set(...args: any[]): void {
    for (const condition of this._blockConditions) if (condition()) return;
    this._set(...args);
    this._watchers.forEach((watcher) => watcher(this.value));
  }

  private _set(...args: any[]): void {
    // (newValue: T) => void
    if (args.length === 1) {
      this._reactSet(args[0]);
      return;
    }
    if (args.length == 2) {
      // set array item
      // (findItem: (item: T) => boolean, newValue: T) => void
      if (typeof args[0] == "function") {
        const findItem = args[0] as (item: T) => boolean;
        const newItem = args[1] as T;
        this._reactSet((prevObj: T) => {
          return (prevObj as any[]).map((item) =>
            findItem(item) ? newItem : item
          );
        });
        return;
      }
      // (path: (string | number)[], value: any) => void
      if (Array.isArray(args[0])) {
        const path = args[0] as (string | number)[];
        const value = args[1] as any;
        this._reactSet((prevObj: T) => Objects.cloneSet(prevObj, path, value));
        return;
      }
    }
    throw new Error("Invalid arguments");
  }

  watch(callback: (value: T) => void): void {
    this._watchers.push(callback);
  }

  on(newValue: T, callback: (value: T) => void): void {
    this.watch((value) => {
      if (value === newValue) callback(value);
    });
  }

  blockWhile(condition: () => boolean): void {
    this._blockConditions.push(condition);
  }
}

export { Objects, ReactiveValue };
