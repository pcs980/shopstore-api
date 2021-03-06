import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/postgresql';

export interface UserUpdateRequest {
  id: number;
  name?: string;
  password?: string;
  email_verified?: boolean;
}

interface UserAttributes {
  id: number;
  name: string;
  password: string;
  email: string;
  token?: string;
  verification_code: string;
  email_verified: boolean;
  registered_at?: Date;
  updated_at?: Date;
}
export interface CreateUserRequest extends
  Optional<UserAttributes, 'id' | 'token' | 'email_verified' | 'verification_code' | 'registered_at' | 'updated_at'> {}

class User extends Model<UserAttributes, CreateUserRequest> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public token!: string;
  public verification_code!: string;
  public email_verified!: boolean;
  public readonly registered_at!: Date;
  public readonly updated_at!: Date;
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  verification_code: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'User',
  freezeTableName: true,
  createdAt: 'registered_at',
  updatedAt: 'updated_at',
});

export default User;
