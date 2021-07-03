import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '@app/_services/auth.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardCustomer implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private logger: NGXLogger) {
  }
//Ovo koristiti za customera a auth-guard.service za admin
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const jwt = this.authService.jwtSubject.getValue();
    if (jwt == null) {
      this.logger.debug(`User not logged in`);
      // TODO Proslijediti get parametre
      this.router.navigate(["/rezervacijeregister"])
      return false;
    }

    const isValid = jwt.refreshTokenIsValid();
    this.logger.debug(`User logged in? ${isValid}`);
    return isValid;
  }

}
