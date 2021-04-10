import k from '../utils/constants';

export default class InternalError extends Error {
  public readonly name = k.INTERNAL_ERROR;

  constructor(
    public code: string,
    public reason: string,
    public detail: string,
  ) {
    super(reason);
  }
}
