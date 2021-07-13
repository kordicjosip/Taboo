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
    const user = this.authService.korisnikSubject.getValue();

    switch (user?.admin) {
      case true: {
        return true
      }
      case false: {
        this.logger.debug(`User not admin`);
        this.router.navigate([""])
        return false
      }
      default: {
        this.logger.debug(`User not logged in`);
        this.router.navigate(["/admin/login"]);
        return false
      }
    }
  }
}
