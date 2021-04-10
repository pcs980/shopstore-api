import k from '../utils/constants';

export default class DatabaseError extends Error {
  public readonly name = k.DATABASE_ERROR;

  constructor(
    public code: string,
    public message: string,
    public detail: string,
  ) {
    super(message);
  }
}
