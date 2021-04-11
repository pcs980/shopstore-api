import k from '../utils/constants';

export default class RequestError extends Error {
  public readonly name = k.REQUEST_ERROR;

  constructor(
    public code: string,
    public message: string,
    public detail: string,
  ) {
    super(message);
  }
}
