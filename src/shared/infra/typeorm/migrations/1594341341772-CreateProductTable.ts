import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProductTable1594341341772
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productTable = new Table({
      name: 'products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'price',
          type: 'decimal',
          precision: 7,
          scale: 2,
        },
        {
          name: 'quantity',
          type: 'numeric',
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
    });

    await queryRunner.createTable(productTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
