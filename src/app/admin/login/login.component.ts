import {Component, OnInit} from '@angular/core';
import {AuthService} from "@app/_services/auth.service";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private logger: NGXLogger,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.isLoggedIn())
      this.router.navigate(["/admin"]);
  }

  login() {
    let username = (document.getElementById("username") as HTMLInputElement).value;
    let password = (document.getElementById("password") as HTMLInputElement).value;
    this.logger.debug(`Vrijednost username: ${username}`);
    this.logger.debug(`Vrijednost passworda: ${password}`);
    this.authService.login(username, password, true).subscribe(
      () => {
        this.logger.debug("Successful login");
        this.authService.korisnikSubject.subscribe(
          user => {
            if (user != null) {
              this.router.navigate(["/admin"]);
            }
          }
        )
      },
      error => {
        this.logger.debug(`Error while logging in: ${JSON.stringify(error, null, 2)}`)
      }
    );
  }

  isLoggedIn() {
    return this.authService.jwtSubject.getValue() != null;
  }

}
