import { Dispatch, SetStateAction, useState } from "react";

type Obj = Record<string | number, unknown>;

class Objects {
  // Mutable set: Modifies the original object directly
  static set(obj: Obj, path: (string | number)[], value: unknown) {
    let temp: Obj = obj;

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
          : { ...(temp[key] as Obj) };
      }
      temp = temp[key] as Obj;
    });

    return obj;
  }

  // Immutable cloneSet: Returns a new object with updated path
  static cloneSet(obj: Obj, path: (string | number)[], value: unknown) {
    const clonedObj = Objects.clone(obj);
    let temp = clonedObj;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        temp[key] = value;
      } else {
        // Handle arrays and objects
        if (!temp[key]) {
          temp[key] = Array.isArray(temp[key]) ? [] : {};
        }
        temp[key] = Array.isArray(temp[key])
          ? [...temp[key]]
          : { ...temp[key] };
      }
      temp = temp[key];
    });

    return clonedObj;
  }

  static setReactive(
    setState: React.Dispatch<React.SetStateAction<any>>,
    path: (string | number)[],
    value: unknown
  ) {
    // Update the state using the setState function
    setState((prevState: Obj) => {
      const updatedObj = { ...prevState } as Obj;
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
            : { ...(temp[key] as Obj) };
        }
        temp = temp[key] as Obj;
      });

      return updatedObj;
    });
  }

  static clone(obj: Obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

class Reactive {
  static value<T>(value: T): ReactiveValue<T> {
    return ReactiveValue.from(value);
  }

  static array<T>(items: T[]): ReactiveArray<T> {
    return ReactiveArray.from(items);
  }
}

class ReactiveValue<T> {
  value: T;
  private _reactSet: Dispatch<SetStateAction<T>>;

  private _watchers: ((value: T) => void)[] = [];
  private _blockConditions: (() => boolean)[] = [];

  private constructor(value: T) {
    const [rValue, rSet] = useState(value);
    this.value = rValue;
    this._reactSet = rSet;
  }

  static from<T>(value: T): ReactiveValue<T> {
    return new ReactiveValue(value);
  }

  set(...args: unknown[]): void {
    for (const condition of this._blockConditions) if (condition()) return;
    this._set(...args);
    for (const watcher of this._watchers) watcher(this.value);
  }

  private _set(...args: unknown[]): void {
    for (const condition of this._blockConditions) {
      if (condition()) return;
    }
    // (newValue: T) => void
    if (args.length === 1) {
      this._reactSet((prevState: T) => args[0] as T);
      return;
    }
    // (path: (string | number)[], value: any) => void
    if (args.length == 2) {
      if (Array.isArray(args[0])) {
        const path = args[0] as (string | number)[];
        const value = args[1] as any;
        this._reactSet((prevState: T) =>
          Objects.cloneSet(prevState as Obj, path, value)
        );
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

class ReactiveArray<T> {
  items: T[];
  private _reactSetItems: Dispatch<SetStateAction<T[]>>;

  private constructor(items: T[]) {
    const [rItems, rSetItems] = useState(items);
    this.items = rItems;
    this._reactSetItems = rSetItems;
  }

  static from<T>(items: T[]): ReactiveArray<T> {
    return new ReactiveArray(items);
  }

  set(findItem: (item: T) => boolean, newItem: T): void {
    this._reactSetItems((prevItems: T[]) => {
      return prevItems.map((item) => (findItem(item) ? newItem : item));
    });
  }
}

export { Objects, Reactive };
