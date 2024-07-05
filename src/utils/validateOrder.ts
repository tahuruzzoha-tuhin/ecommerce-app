import { z, ZodError } from 'zod';

const CreateOrderSchema = z.object({
  email: z.string().email(),
  productId: z.string(),
  price: z.number().positive(),
  quantity: z.number().min(1),
});

// Type for the order creation data
type CreateOrderData = z.infer<typeof CreateOrderSchema>;



// ############ ORDER VALIDATOR ###############
const validateCreateOrder = (data: unknown) => {
  try {
    const validatedData = CreateOrderSchema.parse(data);
    return validatedData as CreateOrderData;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.errors.map(err => err.message).join(', '));
    } else {
      throw error;
    }
  }
};



// ############ EMAIL VALIDATOR FOR SEARCH PARAMS ###############
const emailSchema = z.string().email();
const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
};


export  {
    validateCreateOrder,
    isValidEmail
};
