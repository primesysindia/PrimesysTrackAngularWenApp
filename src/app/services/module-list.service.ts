import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../core/user.model';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleListService {
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/';

  constructor(private http: HttpClient, private loginServ: LoginService) { }

  getUserModuleList(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let user: User = JSON.parse(localStorage.getItem('currentUserInfo'))
    let userId = user.usrId.toString()
    let roleId = user.roleId.toString()

    let params = new HttpParams()
    .set('UserId', userId)
    .set('RoleId',roleId)

    return this.http.post(this.loginServ.apiUrl+'ParentAPI/GetUserNewModuleList', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getUtilityList(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let user: User = JSON.parse(localStorage.getItem('currentUserInfo'))
    let userId = user.usrId.toString()
    let roleId = user.roleId.toString()

    let params = new HttpParams()
    .set('UserId', userId)
    .set('RoleId',roleId)

    return this.http.post(this.loginServ.apiUrl +'ParentAPI/GetUserUtilityAPI', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
}
