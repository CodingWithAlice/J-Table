import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/myapp', {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
