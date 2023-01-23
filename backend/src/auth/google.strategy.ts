import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";


export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(){
        super({
            clientID: '1015520099706-63itpk6urk4p0pf6bcqkt8fci4cccge9.apps.googleusercontent.com', 
            clientSecret: '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',
            callbackURL: 'http://localhost:3042/auth/google/callback',
            scope: ['email', 'profile']
        });
    }
    async validate (accesToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const {name, emails} = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            accesToken,
            refreshToken
        }
        console.log('google user: ', user)
        done(null, user);
    }
}