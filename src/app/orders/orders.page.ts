import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  customers: any[] = [];
  addresses: any[] = [];
  city: string = ',Chihuahua';

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private router: Router
    ) {}

  ngOnInit(): void {
    this.authService.getCustomer().subscribe(
      (data: any[]) => {
        // Add a 'selected' property to each customer
        this.customers = data.map(customer => ({ ...customer, selected: false }));
      },
      (error) => {
        console.log('Error fetching customer information:', error);
      }
    );
  }

  addAddress(address,number,locality){
    let _address = `${address}, ${number}, ${locality}`;
    this.addresses.push(_address);
    console.log(this.addresses);
  }

  toggleValue(event: any,address:string,number:string,locality:string) {
    const valueToAdd = `${address}, ${number}, ${locality} ${this.city}`;
    

    if (event.detail.checked) {
      // If checkbox is checked and value isn't in array, add it
      if (!this.addresses.includes(valueToAdd)) {
        this.addresses.push(valueToAdd);
      }
    } else {
      // If checkbox is unchecked, remove the value from array
      const index = this.addresses.indexOf(valueToAdd);
      if (index > -1) {
        this.addresses.splice(index, 1);
      }
    }

    console.log(this.addresses); // Just for debugging
  }

////////////////////////////////////////////////////////////////////77



  calculateTotalPrice() {
    // Calculate total price based on selected customers
    const selectedCustomers = this.customers.filter(customer => customer.selected);
    let totalPrice = 0;
    for (const customer of selectedCustomers) {
      totalPrice += parseFloat(customer.customer.total_spent);
    }
    return totalPrice.toFixed(2);
  }


  createRoute() {
    const selectedCustomers = this.customers.filter(customer => customer.selected);
    const selectedWaypoints = selectedCustomers.map(customer => {
      const address = customer.customer.default_address.address;
      const num = customer.customer.default_address.number;
      const locality = customer.customer.default_address.locality;
      const city = customer.customer.default_address.city;
/*       const currLocation = `${address}, ${num}, ${locality} Chihuahua`;
      localStorage.setItem('selectedLocation', currLocation); */
      let addressArray =  JSON.stringify(this.addresses);
      localStorage.setItem('selectedLocations', addressArray);

      return `${address}, ${num}, ${locality}, ${city}`;
    });

    let navigationExtras = {
      state: {
        locations:  this.addresses
      }
    };

    this.router.navigate(['/map'], navigationExtras);
  }
}



