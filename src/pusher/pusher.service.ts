import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '1903274',
      key: 'baf272c3ebeb38fafc18',
      secret: 'd11fb90b613ccfc8da29',
      cluster: 'eu',
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: any) {
    return await this.pusher.trigger(channel, event, data);
  }
}
