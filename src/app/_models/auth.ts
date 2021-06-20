import jwt_decode from 'jwt-decode';

interface JWTToken {
  access_token: string;
  refresh_token: string;
}

export class AuthJWTToken {
  access_token: string;
  refresh_token: string;

  constructor(json: JWTToken) {
    this.access_token = json.access_token;
    this.refresh_token = json.refresh_token;
  }

  accessTokenIsValid(): boolean {
    console.log(jwt_decode(this.access_token))
    // TODO provjeriti valjanost, ključ exp sadrži timestamp do kada je valjan token
    return true
  }

  refreshTokenIsValid(): boolean {
    console.log(jwt_decode(this.refresh_token))
    // TODO provjeriti valjanost, ključ exp sadrži timestamp do kada je valjan token
    return true
  }
}
