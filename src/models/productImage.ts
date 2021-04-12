import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/postgresql';

interface ProductImageAttributes {
  id: number;
  product_id: number;
  image_type: string;
  image_name?: any;
  created_at?: Date;
  updated_at?: Date;
}
export interface CreateProductRequest extends
  Optional<ProductImageAttributes, 'id' | 'created_at' | 'updated_at'> {}

class ProductImage extends Model<ProductImageAttributes, CreateProductRequest> implements ProductImageAttributes {
  public id!: number;
  public product_id!: number;
  public image_type!: string;
  public image_name!: any;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProductImage.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'Product',
      key: 'id'
    },
  },
  image_type: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  image_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ProductImage',
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ProductImage;
