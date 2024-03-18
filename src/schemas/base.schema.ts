import { Prop } from '@nestjs/mongoose';

export class BaseSchema {
  @Prop({ default: Date.now() })
  createdAt?: Date;

  @Prop()
  createdBy?: string;

  @Prop({ default: Date.now() })
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}
