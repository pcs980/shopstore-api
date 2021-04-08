interface DatabaseErrorAttributes {
  message: string;
}

export class DatabaseError extends Error implements DatabaseErrorAttributes {
  public readonly name = 'DatabaseError';

  constructor(
    public message: string,
    public detail: string,
    public code: string,
  ) {
    super(message);
  }
}
