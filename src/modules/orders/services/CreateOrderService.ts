import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IProductMap {
  [id: string]: number;
}

interface IProductOrder {
  product_id: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrderRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const productMap = {} as IProductMap;
    products.forEach(product => {
      productMap[product.id] = product.quantity;
    });

    const dbProducts = await this.productsRepository.findAllById(products);

    if (dbProducts.length !== products.length) {
      throw new AppError('Some products cannot be found');
    }

    const productOrders = [] as IProductOrder[];
    const newProductQuantities = [] as IProduct[];

    dbProducts.forEach(dbProduct => {
      const productId = dbProduct.id;
      const requestedQuantity = productMap[productId];

      if (dbProduct.quantity < requestedQuantity) {
        throw new AppError(`Insuficient quantity of ${dbProduct.name}`);
      }

      productOrders.push({
        product_id: productId,
        price: dbProduct.price,
        quantity: requestedQuantity,
      });

      newProductQuantities.push({
        id: productId,
        quantity: dbProduct.quantity - requestedQuantity,
      });
    });

    await this.productsRepository.updateQuantity(newProductQuantities);

    const order = await this.ordersRepository.create({
      customer,
      products: productOrders,
    });

    return order;
  }
}

export default CreateOrderService;
