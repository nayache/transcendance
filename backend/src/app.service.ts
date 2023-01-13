import { BadRequestException, Injectable } from '@nestjs/common';
import { setMaxIdleHTTPParsers } from 'http';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async sayHello(token: string) {
    //const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    //await sleep(3000);
    try {
      const res = await fetch('https://api.intra.42.fr/v2/me', { headers: { 'Authorization': `Bearer ${token}` } });
      console.log(res.status);
      const data = await res.json();
      this.printHello(data.login)
    } catch (err) {
      throw new BadRequestException();
    }
  }

  printHello(login: string) {
    console.log("Welcome " + login);
  }
}
