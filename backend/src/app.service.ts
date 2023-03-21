import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  sleep() {
    return new Promise(resolve => setTimeout(resolve, 4000))
  }

  async sayHello(token: string) {
    try {
      const res = await fetch('https://api.intra.42.fr/v2/me', { headers: { 'Authorization': `Bearer ${token}` } });
      // console.log('->', res.status);
      const data = await res.json();
      this.printHello(data.login)
    } catch (err) {
      throw new BadRequestException();
    }
  }

  printHello(login: string) {
    // console.log("Welcome " + login);
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    return {
      message: 'user info from google',
      user: req.user
    }
  }
}
