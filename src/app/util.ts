import { Dispatch, SetStateAction } from "react";

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
    setState: React.Dispatch<React.SetStateAction<unknown>>,
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
  static value<T>(
    useStateDef: [T, Dispatch<SetStateAction<T>>]
  ): ReactiveValue<T> {
    return ReactiveValue.from(useStateDef);
  }

  static array<T>(
    useStateDef: [T[], Dispatch<SetStateAction<T[]>>]
  ): ReactiveArray<T> {
    return ReactiveArray.from(useStateDef);
  }
}

class ReactiveValue<T> {
  value: T;
  private _reactSet: Dispatch<SetStateAction<T>>;

  private _watchers: ((value: T) => void)[] = [];
  private _blockConditions: (() => boolean)[] = [];

  private constructor(useStateDef: [T, Dispatch<SetStateAction<T>>]) {
    this.value = useStateDef[0];
    this._reactSet = useStateDef[1];
  }

  static from<T>(
    useStateDef: [T, Dispatch<SetStateAction<T>>]
  ): ReactiveValue<T> {
    return new ReactiveValue(useStateDef);
  }

  set(...args: unknown[]): void {
    for (const condition of this._blockConditions) if (condition()) return;
    this._set(...args);
    for (const watcher of this._watchers) watcher(this.value);
  }

  private _set(...args: unknown[]): void {
    // (newValue: T) => void
    if (args.length === 1) {
      const newValue = args[0] as T;
      this.value = newValue;
      this._reactSet(() => newValue);
      return;
    }
    // (path: (string | number)[], value: any) => void
    if (args.length == 2) {
      if (Array.isArray(args[0])) {
        const path = args[0] as (string | number)[];
        const value = args[1] as unknown;
        Objects.set(this.value as Obj, path, value);
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

  private constructor(useStateDef: [T[], Dispatch<SetStateAction<T[]>>]) {
    this.items = useStateDef[0];
    this._reactSetItems = useStateDef[1];
  }

  static from<T>(
    useStateDef: [T[], Dispatch<SetStateAction<T[]>>]
  ): ReactiveArray<T> {
    return new ReactiveArray(useStateDef);
  }

  set(findItem: (item: T) => boolean, newItem: T): void {
    this._reactSetItems((prevItems: T[]) => {
      return prevItems.map((item) => (findItem(item) ? newItem : item));
    });
  }
}

export { Objects, Reactive };
