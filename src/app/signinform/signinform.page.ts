import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-signinform',
  templateUrl: './signinform.page.html',
  styleUrls: ['./signinform.page.scss'],
})
export class SigninformPage implements OnInit {

  email:string = '';
  password:string = '';

  constructor(private authService: AuthService, private alertController: AlertController, private navCtrl: NavController, private router: Router, private storage: Storage) { }

  async ngOnInit() {
    await this.storage.create();
    // await this.retrieveStorkedData();
  }

 login() {
    
    //this.router.navigate(['/map']);//
    // console.log(this.email, this.password)
    this.authService.login(this.email, this.password).subscribe(
      async (response) => {
        // Store the response data
        // localStorage.setItem('responseData',response._token);
        await this.storage.set('token', response._token).then(()=>{
          console.log("token saved");
        });
        await this.storage.get('token').then((tk)=>{
          console.log("token gotten");
          if(tk){
            this.router.navigate(['/orders']);
          }
          
        });
        
        
        //await this.storage.get('token');
        //Move to the route map
        
        // Login successful, handle the response
        // console.log("it works");
      },
      async (error) => {
        // Login failed, handle the error
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Invalid username or password.',
          buttons: ['OK']
        });
    
        await alert.present();
        console.log(error);
        // console.error(error);
      }
      
      );
    }
  //   async retrieveStoredData() {
  //     const responseData = await this.storage.get('responseData');
  //     if (responseData) {
  //       console.log("Stored response data is:", responseData);
  //     // Do something with the retrieved data
  //   } else {
  //     console.log("No stored response data found");
  //   }
  // }
  
  
}
