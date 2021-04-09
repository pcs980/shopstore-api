export default class DatabaseError extends Error {
  public readonly name = 'DatabaseError';

  constructor(
    public code: string,
    public message: string,
    public detail: string,
  ) {
    super(message);
  }
}
