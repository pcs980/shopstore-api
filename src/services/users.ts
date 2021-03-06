import UserModel, { CreateUserRequest, UserUpdateRequest } from '../models/user';
import { DatabaseError, RequestError } from '../errors';
import Queue from './queue';
import logger from '../utils/logger';
import { compareHash, hashText } from '../utils/crypt';
import { signPayload } from '../utils/jwt';
import { generateCode } from '../utils/generators';
import k from '../utils/constants';

export interface SigninRequest {
  email: string;
  password: string;
}

export interface GetUserRequest {
  id?: number;
  email?: string;
}

export interface ConfirmCodeRequest {
  id: number;
  code: string;
}

const confirmCode = async (request: ConfirmCodeRequest): Promise<UserModel> => {
  const user = await getOne({ id: request.id });
  logger.debug(`Confirm code of ${user.email}: ${user.verification_code} x ${request.code}`);

  if (Number(user.verification_code) !== Number(request.code)) {
    throw new RequestError(
      'INVALID_CODE',
      'Your code is invalid',
      'Verify the verification code sent to your e-mail',
    );
  }

  if (!user.email_verified) {
    try {
      const result = await update({
        id: request.id,
        email_verified: true,
      });
      logger.debug(`Confirm code done: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  } else {
    logger.debug(`E-mail already verified: ${JSON.stringify(user)}`);
    return user;
  }
};

const create = async (user: CreateUserRequest): Promise<UserModel> => {
  try {
    const hashedPassword = await hashText(user.password);
    const result: UserModel = await UserModel.create<UserModel>({
      ...user,
      verification_code: generateCode(4),
      password: hashedPassword,
    });
    const newUser = <UserModel>result.toJSON();
    logger.debug(`New user: ${JSON.stringify(newUser)}`);

    // Create job ConfirmEmail if Redis is configured
    if (k.REDIS.HOST) {
      await Queue.add('ConfirmEmail', { ...newUser });
    } else {
      logger.warn(`Confirmation e-mail will not be sent because Redis host is not setted.`)
    }

    return newUser;
  } catch (error) {
    logger.error(`Create user error: ${JSON.stringify(error)}`);
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        'UNQ_CONS_VIOLATION',
        'Unique constraint violation',
        error.parent?.detail
      );
    }
    throw new Error(error);
  }
};

const destroy = async (id: number): Promise<boolean> => {
  const result = await UserModel.destroy({
    where: {
      id
    }
  });
  return result > 0;
};

const getOne = async (request: GetUserRequest): Promise<UserModel> => {
  const user = await UserModel.findOne({ where: { ...request } });
  if (!user) {
    logger.warn(`User not found with id: ${request.id}`);
    throw new DatabaseError(
      'NOT_FOUND',
      'User not found',
      JSON.stringify(request),
    );
  }
  return <UserModel>user.toJSON();
};

const signin = async (credential: SigninRequest, user?: UserModel): Promise<UserModel> => {
  try {
    const userResult = user ? user : await getOne({ email: credential.email });
    const isValidPassword = await compareHash(credential.password, userResult.password);

    if (!isValidPassword) {
      logger.warn(`Invalid password: ${credential.email}/${credential.password}`);
      throw new RequestError(
        'INVALID_CREDENTIAL',
        'Your email or password is invalid password',
        credential.email,
      );
    }

    const token = signPayload({
      id: userResult.id,
      name: userResult.name,
    });
    userResult.token = token;
    return userResult;
  } catch (error) {
    logger.error(`Signin error: ${error.message} ${JSON.stringify(error)}`)
    throw error;
  }
};

const signup = async (user: CreateUserRequest): Promise<UserModel> => {
  const newUser = await create(user);
  const signedUser = await signin({ email: newUser.email, password: user.password }, newUser);
  return signedUser;
};

const update = async (request: UserUpdateRequest): Promise<UserModel> => {
  let count: number;
  let rows: UserModel[];
  try {
    if (request.password) {
      request.password = await hashText(request.password);
    }

    [count, rows] = await UserModel.update({
      ...request
    }, {
      where: { id: request.id },
      returning: true,
      limit: 1,
    });
    logger.debug(`Update affected ${count} rows`);
  } catch (error) {
    logger.error(`Update user error: ${error.message} ${JSON.stringify(error)}`);
    throw new DatabaseError(
      'UPDATE_ERROR',
      error.message,
      JSON.stringify(request),
    );
  }

  if (count === 0) {
    throw new DatabaseError(
      'NOT_FOUND',
      'Update affect no users',
      JSON.stringify(request),
    );
  }
  return <UserModel>rows[0].toJSON();
};

export {
  create,
  confirmCode,
  destroy,
  getOne,
  signin,
  signup,
  update,
};
