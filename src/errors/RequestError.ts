export default class RequestError extends Error {
  public readonly name = 'RequestError';

  constructor(
    public code: string,
    public message: string,
    public detail: string,
  ) {
    super(message);
  }
}
