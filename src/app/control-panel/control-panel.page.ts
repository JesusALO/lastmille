import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'path-to-auth-service'; // Replace 'path-to-auth-service' with the correct path to your auth service
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.page.html',
  styleUrls: ['./control-panel.page.scss'],
})
export class ControlPanelPage implements OnInit {
  employees$: Observable<any[]>; // Declare employees$ as an Observable<any[]>
  employee: any = {};
  showAddForm = false;
  showEditForm = false;

  constructor(private menuController: MenuController, private authService: AuthService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  // Function to toggle the sidebar
  toggleSidebar() {
    this.menuController.toggle();
  }

  // Function to load employees from the auth service
  loadEmployees() {
    this.employees$ = this.authService.getEmployee().pipe(
      tap((employees) => console.log(employees)), // Log the response
      
      catchError((error) => {
        console.log('Error fetching Employee information:', error); // Log any error
        return []; // Return an empty array as an Observable in case of an error
      })
    );
  }
  

  // Function to show the add employee form
  showAddEmployeeForm() {
    this.showAddForm = true;
    this.employee = {}; // Clear employee object for new entry
  }

  // Function to show the edit employee form with existing data
  showEditEmployeeForm(employee: any) {
    this.showEditForm = true;
    this.employee = { ...employee }; // Copy employee details for editing
  }

  // Function to save or update employee details
  saveEmployee() {
    this.authService.createEmployee(this.employee).subscribe((response) => {
      // Reload the employee list after successful creation
      this.loadEmployees();
      this.cancelForm(); // Clear the form and hide it after saving
    });
  }

  updateEmployee() {
    this.authService.updateEmployee(this.employee._id, this.employee).subscribe((response) => {
      // Reload the employee list after successful update
      this.loadEmployees();
      this.cancelForm(); // Clear the form and hide it after updating
    });
  }

  // Function to delete an employee
  deleteEmployee(employee: any) {
    this.authService.deleteEmployee(employee._id).subscribe(() => {
      // Reload the employee list after successful deletion
      this.loadEmployees();
    });
  }

  // Function to cancel the form and hide it
  cancelForm() {
    this.employee = {};
    this.showAddForm = false;
    this.showEditForm = false;
  }
  
}


