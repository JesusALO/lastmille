import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public currLocations: any[] = [];
  private directionsService: any;
  map: any;
  waypoints: any[] = [];
  private directionsRenderer: any;
  private currentPositionMarker: any;
  private currentLocationInterval: any;
  estimatedTravelTimes: string[] = [];
  selectedWaypoint: string;

  constructor(
    private activatedRoute: ActivatedRoute, // Inject ActivatedRoute
    private router: Router // Inject Router
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
    this.currLocations = JSON.parse(localStorage.getItem('selectedLocations') || '[]');
    
    console.log(this.currLocations);
  
    // Retrieve waypoints from route state
    this.activatedRoute.queryParams.subscribe(params => {
      const state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['waypoints']) {
        this.waypoints = state['waypoints'];
        
        this.addCurrentLocationWaypoint();
      }
    });
  
    // Call startUpdatingCurrentLocation() here
    this.startUpdatingCurrentLocation();
  }
  
  public initializeMap() {
    const mapOptions = {
      center: { lat: 28.637240, lng: -106.075057 }, // Set the initial position of the map
      zoom: 12, // Adjust the initial zoom level
    };

    const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, mapOptions);

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
    this.map = map;

    if(this.currLocations){
      for (const address of this.currLocations) {
        this.geocodeAddress(address).then(location => {
            new google.maps.Marker({
                map: this.map,
                position: location
            });
        }).catch(error => {
            console.error('Error placing marker for address:', address, 'Error:', error);
        });
    }
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

private startUpdatingCurrentLocation() {
  if (this.currentLocationInterval) {
    clearInterval(this.currentLocationInterval); // Clear the current location interval if it exists
  }

  this.currentLocationInterval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.updateCurrentPositionMarker(latLng);
      },
      (error: any) => {
        console.log('Error getting current position:', error.message);
      }
    );
  }, 10000); // Update every 10 seconds
}

private updateCurrentPositionMarker(latLng: any) {
  if (this.currentPositionMarker) {
    this.currentPositionMarker.setPosition(latLng);
  } else {
    this.currentPositionMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    });
  }
}



private addCurrentLocationWaypoint() {
  navigator.geolocation.getCurrentPosition(
    (position: any) => {
      const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.waypoints.unshift({ location: latLng }); // Add current location as the first waypoint
      this.calculateAndDisplayRoute(); // Calculate route between current location and other waypoints
    },
    (error: any) => {
      console.log('Error getting current position:', error.message);
    }
  );
}

private calculateAndDisplayRoute() {
  console.log('Calculating and displaying route...'); // Add this line

  if (this.waypoints.length < 2) {
    console.log('Not enough waypoints to calculate route.');
    return;
  }

  const directionsRequest = {
    origin: this.waypoints[0]?.location,
    destination: this.waypoints[this.waypoints.length - 1]?.location,
    waypoints: this.waypoints.slice(1, -1).map(waypoint => ({ location: waypoint.location })),
    optimizeWaypoints: true,
    travelMode: 'DRIVING',
  };

  this.directionsService.route(directionsRequest, (response: any, status: any) => {
    console.log('Directions response:', response); // Add this line
    console.log('Directions status:', status); // Add this line

    if (status === 'OK') {
      this.directionsRenderer.setDirections(response);

      const legs = response.routes[0].legs;

      this.estimatedTravelTimes = legs.map((leg: any) => leg.duration.text);

      // No need to call startUpdatingCurrentLocation() again here
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
}



}
