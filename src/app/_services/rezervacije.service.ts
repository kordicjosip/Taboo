import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AuthJWTToken} from "@app/_models/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import{Rezervacija} from "@app/_models/rezervacija";


@Injectable({
  providedIn: 'root'
})
export class RezervacijeService {




  private refreshTokenTimeout: any;

  constructor(

    private http: HttpClient,
    private logger: NGXLogger,

  ) {}



}


