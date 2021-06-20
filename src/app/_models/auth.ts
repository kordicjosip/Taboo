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

  getExpiration(jwt: string): Date {
    return new Date(JSON.parse(atob(jwt.split('.')[1])).exp * 1000);
  }

  accessTokenIsValid(): boolean {
    this.getExpiration(this.access_token)
    // TODO provjeriti valjanost, ključ exp sadrži timestamp do kada je valjan token
    return true
  }

  refreshTokenIsValid(): boolean {
    this.getExpiration(this.refresh_token)
    // TODO provjeriti valjanost, ključ exp sadrži timestamp do kada je valjan token
    return true
  }
}
