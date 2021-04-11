import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/postgresql';

export interface ProductUpdateRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  active?: boolean;
}

interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  active?: boolean;
  published_at?: Date;
  updated_at?: Date;
}
export interface CreateProductRequest extends
  Optional<ProductAttributes, 'id' | 'published_at' | 'updated_at'> {}

class Product extends Model<ProductAttributes, CreateProductRequest> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public active!: boolean;
  public readonly published_at!: Date;
  public readonly updated_at!: Date;
}

Product.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(150),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'Product',
  freezeTableName: true,
  createdAt: 'published_at',
  updatedAt: 'updated_at',
});

export default Product;
