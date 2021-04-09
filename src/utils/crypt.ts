import { hash, compare, genSalt } from 'bcrypt';
import { InternalError } from '../errors';

const hashText = async (text: string): Promise<string> => {
  try {
    const salt = await genSalt(8);
    return await hash(text, salt);
  } catch (error) {
    throw new InternalError(
      'ERR_HASH_FAIL',
      'Error on encrypting from text',
      error.message,
    );
  }
};

const compareHash = async (text: string, hash: string): Promise<boolean> => {
  try {
    return await compare(text, hash);
  } catch (error) {
    throw new InternalError(
      'ERR_COMPARE_FAIL',
      'Error on comparing hash',
      error.message,
    );
  }
};

export {
  compareHash,
  hashText,
};
