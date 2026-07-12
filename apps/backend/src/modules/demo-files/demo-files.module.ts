import { Module } from '@nestjs/common';

import { DemoFilesController } from './demo-files.controller';

@Module({
  controllers: [DemoFilesController],
})
export class DemoFilesModule {}
