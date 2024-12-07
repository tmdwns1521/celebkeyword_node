import { Expose } from 'class-transformer';

export class TrandkeywordDTO {
  @Expose()
  keyword: string;

  @Expose()
  rank: number;

  @Expose()
  platform: string;
}
