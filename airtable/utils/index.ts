export class Dictionary {
    #keys: string[] = [];
    #values: any[] = [];
  
    set(key: string, value: any) {
      if (!this.#keys.includes(key)) {
        this.#keys.push(key);
        this.#values.push(value);
        return true;
      } else {
        const i = this.#keys.indexOf(key);
        this.#values[i] = value;
        return true;
      }
    }
  
    get(key: string) {
      if (this.#keys.includes(key)) {
        const i = this.#keys.indexOf(key);
        return this.#values[i];
      }
      return null;
    }
  
    delete(key: string) {
      if (this.#keys.includes(key)) {
        const i = this.#keys.indexOf(key);
        this.#values.splice(i, 1);
        this.#keys.splice(i, 1);
      }
    }
    listKeys() {
      return this.#keys;
    }
    getValues() {
      return this.#values;
    }
    containsKey(key: string) {
      return this.#keys.includes(key);
    }
  
    isEmpty() {
      return this.#keys.length === 0;
    }
  
    length() {
      return this.#keys.length;
    }
  }