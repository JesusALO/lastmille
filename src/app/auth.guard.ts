import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'path-to-auth-service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private storage: Storage) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      
      // Use an asynchronous function to check authentication status
      const isAuthenticated = await this.storage.get('token');
      
      // console.log(isAuthenticated);
      
      if (isAuthenticated){
        return true;
      }
      else{
        const navigation = this.router.getCurrentNavigation();
        console.log('nav: ', navigation);

        let url = '/';
        if(navigation){
          url = navigation.extractedUrl.toString();
        }
        this.router.navigateByUrl('/signinform');
        return false;
      }
    }
}
