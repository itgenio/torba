export class CustomError extends Error {
  constructor(name: string, readonly message: string = '') {
    super(name);
    this.name = name;
  }
}
