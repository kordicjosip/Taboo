import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '@app/_services/auth.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private logger: NGXLogger) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const jwt = this.authService.jwtSubject.getValue();
    if (jwt == null) {
      this.logger.debug(`User not logged in`);
      this.router.navigate(["/admin/login"])
      return false;
    }

    const user = this.authService.korisnikSubject.getValue();
    if(user!=null && user.admin){
      return true;
    }
    //navigate na home ako user nije admin
    else{
      this.router.navigate([""])
      return false;
    }
  }

}
