export default class InternalError extends Error {
  public readonly name = 'InternalError';

  constructor(
    public code: string,
    public message: string,
    public detail: string,
  ) {
    super(message);
  }
}
