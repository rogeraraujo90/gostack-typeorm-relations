import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrdersProductsTable1594572677629
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const orderProductsTable = new Table({
      name: 'orders_products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'product_id',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'order_id',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'price',
          type: 'decimal',
          precision: 7,
          scale: 2,
        },
        {
          name: 'quantity',
          type: 'integer',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
      foreignKeys: [
        {
          columnNames: ['order_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onUpdate: 'cascade',
        },
        {
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onUpdate: 'cascade',
        },
      ],
    });

    await queryRunner.createTable(orderProductsTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders_products');
  }
}
