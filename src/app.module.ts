import { Module } from '@nestjs/common';

// from modules
import { MainModule } from './modules/main.module';

@Module({
  imports: [MainModule],
})
export class AppModule {}
