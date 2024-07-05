import { z } from 'zod';

const VariantSchema = z.object({
  type: z.string(),
  value: z.string(),
});

const InventorySchema = z.object({
  quantity: z.number(),
  inStock: z.boolean(),
});

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  tags: z.array(z.string()),
  variants: z.array(VariantSchema),
  inventory: InventorySchema,
});


// ############ PRODUCT VALIDATOR ###############
export const validateProduct = (productData: any) => {
  const validation = ProductSchema.safeParse(productData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors,
    };
  }
  return { success: true };
};
