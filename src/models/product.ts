import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/postgresql';

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  published_at?: Date;
  updated_at?: Date;
}
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'published_at' | 'description'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
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
}, {
  sequelize,
  modelName: 'Product',
  freezeTableName: true,
  createdAt: 'published_at',
  updatedAt: 'updated_at',
});

export default Product;

/*
Product {
  dataValues: {
    published_at: 2021-04-08T00:44:27.303Z,
    id: '1',
    name: 'Novo produto',
    description: 'Descrição do produto',
    price: '88.96',
    updated_at: 2021-04-08T00:44:27.304Z,
    created_at: 2021-04-08T00:44:27.304Z
  },
  _previousDataValues: {
    name: 'Novo produto',
    description: 'Descrição do produto',
    price: '88.96',
    id: '1',
    published_at: 2021-04-08T00:44:27.303Z,
    created_at: 2021-04-08T00:44:27.304Z,
    updated_at: 2021-04-08T00:44:27.304Z
  },
  _changed: Set {},
  _options: {
    isNewRecord: true,
    _schema: null,
    _schemaDelimiter: '',
    attributes: undefined,
    include: undefined,
    raw: undefined,
    silent: undefined
  },
  isNewRecord: false
}
*/