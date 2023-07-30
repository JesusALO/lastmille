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
    if (this.showAddForm) {
      // Add new employee to the list (Note: You may need to send this data to the backend as well)
      this.authService.getEmployee().pipe(
        tap((response) => (this.employees$ = response))
      ).subscribe(() => {
        // Clear the form and hide it after saving/updating
        this.employee = {};
        this.showAddForm = false;
        this.showEditForm = false;
      });
    } else if (this.showEditForm) {
      // Update employee details in the list (Note: You may need to send this data to the backend as well)
      this.authService.getEmployee().pipe(
        tap((response) => (this.employees$ = response))
      ).subscribe(() => {
        this.employees$.subscribe((employees) => {
          const index = employees.findIndex((emp) => emp.id === this.employee.id);
          if (index !== -1) {
            employees[index] = { ...this.employee };
          }
        });

        // Clear the form and hide it after saving/updating
        this.employee = {};
        this.showAddForm = false;
        this.showEditForm = false;
      });
    }
  }

  // Function to delete an employee
  deleteEmployee(employee: any) {
    this.employees$.subscribe((employees) => {
      const index = employees.findIndex((emp) => emp.id === employee.id);
      if (index !== -1) {
        employees.splice(index, 1);
        this.employees$ = this.authService.getEmployee().pipe(
          tap((response) => (this.employees$ = response))
        );
      }
    });
  }

  // Function to cancel the form and hide it
  cancelForm() {
    this.employee = {};
    this.showAddForm = false;
    this.showEditForm = false;
  }
}

