import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const orderProducts = [] as OrdersProducts[];
    products.forEach(product => {
      orderProducts.push(
        Object.assign(new OrdersProducts(), {
          product_id: product.product_id,
          price: product.price,
          quantity: product.quantity,
        }),
      );
    });

    return this.ormRepository.save({ customer, order_products: orderProducts });
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    return order;
  }
}

export default OrdersRepository;
