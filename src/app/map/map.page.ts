import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public currLocations: any[] = [];
  private directionsService: any;
  private directionsRenderer: any;
  map: any;
  estimatedTravelTimes: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let receivedLocations = this.router.getCurrentNavigation().extras.state['locations'];
        console.log(receivedLocations);
        this.currLocations = receivedLocations;
      }
    });
  }

  ngOnInit() {
    this.initializeMap();
  }

  public initializeMap() {
    const mapOptions = {
      center: { lat: 28.637240, lng: -106.075057 },
      zoom: 12,
    };
    const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, mapOptions);
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
    this.map = map;

    if (this.currLocations) {
      for (const address of this.currLocations) {
        this.geocodeAddress(address).then(location => {
          new google.maps.Marker({
            map: this.map,
            position: location,
          });
        }).catch(error => {
          console.error('Error placing marker for address:', address, 'Error:', error);
        });
      }

      // Call the function to add the current location waypoint and calculate route
      this.addCurrentLocationWaypoint();
    }
  }

  geocodeAddress(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status === 'OK') {
          resolve(results[0].geometry.location);
        } else {
          reject('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  private addCurrentLocationWaypoint() {
    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.currLocations.unshift(latLng); // Add current location as the first waypoint
        this.calculateAndDisplayRoute(); // Calculate and display the route with updated waypoints
      },
      (error: any) => {
        console.log('Error getting current position:', error.message);
      }
    );
  }

  private calculateAndDisplayRoute() {
    // Exit if there are no locations to draw a route
    if (this.currLocations.length === 0) {
      console.error('No locations provided to calculate the route.');
      return;
    }

    const waypoints = this.currLocations.slice(1).map(location => ({ location: location }));

    const request = {
      origin: this.currLocations[0], // Start from the first location
      destination: this.currLocations[this.currLocations.length - 1], // End at the last location
      waypoints: waypoints,
      optimizeWaypoints: true, // Optimize the order of waypoints for the shortest route
      travelMode: 'DRIVING'
    };

    this.directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(response);

        // Reset the travel times array
        this.estimatedTravelTimes = [];

        // Calculating the total distance, total travel time and individual travel times
        let totalDistanceMeters = 0;
        let totalDurationSeconds = 0;
        const legs = response.routes[0].legs;
        for (let i = 0; i < legs.length; i++) {
          totalDistanceMeters += legs[i].distance.value;
          totalDurationSeconds += legs[i].duration.value;

          // Convert individual leg duration to minutes and push to estimatedTravelTimes
          const legDurationMinutes = Math.floor(legs[i].duration.value / 60);
          this.estimatedTravelTimes.push(`${legDurationMinutes} minutes`);
        }

        const totalDistanceKm = totalDistanceMeters / 1000; // Convert to kilometers
        const totalTravelTimeMinutes = totalDurationSeconds / 60; // Convert to minutes

        console.log(`Total distance: ${totalDistanceKm.toFixed(2)} km`);
        console.log(`Total estimated travel time: ${Math.floor(totalTravelTimeMinutes)} minutes`);
      } else {
        console.error('Directions request failed due to', status);
      }
    });
  }
}

