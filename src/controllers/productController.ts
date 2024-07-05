import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import Counter from '../models/Counter';
import { validateProduct, validateProductPartial } from '../utils/validateProduct';
import mongoose from 'mongoose';


// #####################  GET UNIQUE CUSTOM ID FOR FILTERING METHODS (OPTIONAL) ########################
const getNextCustomId = async (entity: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { entity },
    { $inc: { lastId: 1 } },
    { new: true, upsert: true }
  );
  return counter.lastId;
};



// #####################  CREATE PRODUCTS CONTROLLER ########################
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, tags, variants, inventory } = req.body;
    const productData = { name, description, price, category, tags, variants, inventory };

    const validation = validateProduct(productData);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const product_id = await getNextCustomId('product');
    const product = new Product({ ...productData, product_id: product_id });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};


// #####################  GET ALL PROPDUCTS CONTROLLER ########################
export const getAllProducts = async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm?.toString().trim() || '';
  console.log("searchTerm", searchTerm);

  try {
    let products;

    if (searchTerm) {
      products = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });
    } else {
      products = await Product.find();
    }

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: searchTerm ? `No products found matching search term '${searchTerm}'` : 'No products found',
      });
    }

    res.status(200).json({
      success: true,
      message: searchTerm ? `Products matching search term '${searchTerm}' fetched successfully!` : 'Products fetched successfully!',
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};



// #####################  GET PRODUCT BY ID CONTROLLER ########################
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = mongoose.Types.ObjectId.isValid(productId)
      ? await Product.findById(productId)
      : await Product.findOne({ product_id: Number(productId) });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully!',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};



// #####################  UPDATE PRODUCT CONTROLLER ########################
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, tags, variants, inventory } = req.body;

    const productData: Partial<IProduct> = { name, description, price, category, tags, variants, inventory };

    // Validate product data
    const validation = validateProductPartial(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const query = mongoose.Types.ObjectId.isValid(req.params.productId)
      ? { _id: req.params.productId }
      : { product_id: Number(req.params.productId) };

    const product = await Product.findOneAndUpdate(query, productData, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};


// #####################  DELETE PRODUCT CONTROLLER ########################
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.productId)
      ? { _id: req.params.productId }
      : { product_id: Number(req.params.productId) };

    const product = await Product.findOneAndDelete(query);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};

