import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrderTable1594572516879
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const orderTable = new Table({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'customer_id',
          type: 'uuid',
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
          columnNames: ['customer_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'customers',
        },
      ],
    });

    await queryRunner.createTable(orderTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
