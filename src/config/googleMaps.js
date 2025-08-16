// Google Maps configuration for Vadodara food delivery tracking

export const GOOGLE_MAPS_CONFIG = {
  // Your Google Maps API Key (replace with your actual key)
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  
  // Vadodara city center coordinates
  VADODARA_CENTER: {
    lat: 22.3072,
    lng: 73.1812
  },
  
  // Delivery bounds for Vadodara city
  VADODARA_BOUNDS: {
    north: 22.4000,
    south: 22.2000,
    east: 73.3000,
    west: 73.0500
  },
  
  // Map settings optimized for food delivery tracking
  DEFAULT_ZOOM: 13,
  TRACKING_ZOOM: 15,
  
  // Map styling for better visibility
  mapOptions: {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    disableDefaultUI: false,
    gestureHandling: 'cooperative',
    restriction: {
      latLngBounds: {
        north: 22.4000,
        south: 22.2000,
        east: 73.3000,
        west: 73.0500
      },
      strictBounds: false
    }
  },
  
  // Custom map styles for food delivery theme
  mapStyles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    }
  ],
  
  // Vadodara landmark coordinates for reference
  LANDMARKS: {
    SAYAJIGUNJ: { lat: 22.3056, lng: 73.1897 },
    ALKAPURI: { lat: 22.2950, lng: 73.2020 },
    FATEHGUNJ: { lat: 22.3183, lng: 73.1733 },
    MANJALPUR: { lat: 22.2707, lng: 73.1981 },
    WAGHODIA_ROAD: { lat: 22.2847, lng: 73.1533 },
    OLD_PADRA_ROAD: { lat: 22.2583, lng: 73.1333 },
    NEW_VIP_ROAD: { lat: 22.3472, lng: 73.1583 }
  },
  
  // Delivery zones within Vadodara
  DELIVERY_ZONES: [
    {
      name: "Central Vadodara",
      center: { lat: 22.3072, lng: 73.1812 },
      radius: 3, // km
      deliveryFee: 0,
      estimatedTime: 20 // minutes
    },
    {
      name: "Sayajigunj Area",
      center: { lat: 22.3056, lng: 73.1897 },
      radius: 2,
      deliveryFee: 20,
      estimatedTime: 25
    },
    {
      name: "Alkapuri Area",
      center: { lat: 22.2950, lng: 73.2020 },
      radius: 2,
      deliveryFee: 20,
      estimatedTime: 30
    },
    {
      name: "Outer Vadodara",
      center: { lat: 22.3072, lng: 73.1812 },
      radius: 8,
      deliveryFee: 40,
      estimatedTime: 45
    }
  ]
};

// Utility functions for Vadodara delivery
export const VadodaraUtils = {
  // Check if coordinates are within Vadodara delivery bounds
  isWithinDeliveryBounds: (lat, lng) => {
    const bounds = GOOGLE_MAPS_CONFIG.VADODARA_BOUNDS;
    return lat >= bounds.south && 
           lat <= bounds.north && 
           lng >= bounds.west && 
           lng <= bounds.east;
  },
  
  // Calculate distance between two points (Haversine formula)
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },
  
  // Get delivery zone for given coordinates
  getDeliveryZone: (lat, lng) => {
    const zones = GOOGLE_MAPS_CONFIG.DELIVERY_ZONES;
    
    for (const zone of zones) {
      const distance = VadodaraUtils.calculateDistance(
        lat, lng, zone.center.lat, zone.center.lng
      );
      
      if (distance <= zone.radius) {
        return {
          ...zone,
          distance: distance.toFixed(2)
        };
      }
    }
    
    return null; // Outside delivery area
  },
  
  // Format address for Vadodara
  formatVadodaraAddress: (addressComponents) => {
    const address = {
      street: '',
      area: '',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: ''
    };
    
    addressComponents.forEach(component => {
      if (component.types.includes('route')) {
        address.street = component.long_name;
      } else if (component.types.includes('sublocality_level_1')) {
        address.area = component.long_name;
      } else if (component.types.includes('postal_code')) {
        address.pincode = component.long_name;
      }
    });
    
    return address;
  },
  
  // Get estimated delivery time based on location and current time
  getEstimatedDeliveryTime: (restaurantLat, restaurantLng, deliveryLat, deliveryLng) => {
    const distance = VadodaraUtils.calculateDistance(
      restaurantLat, restaurantLng, deliveryLat, deliveryLng
    );
    
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const hour = istTime.getHours();
    
    // Peak hours in Vadodara: 12-2 PM, 7-9 PM
    const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);
    const baseSpeed = isPeakHour ? 15 : 25; // km/h
    
    const travelTime = (distance / baseSpeed) * 60; // minutes
    const prepTime = 15; // minutes
    const bufferTime = 5; // minutes
    
    return Math.ceil(travelTime + prepTime + bufferTime);
  }
};

// Map marker icons for different states
export const MAP_ICONS = {
  RESTAURANT: {
    url: '/icons/restaurant-marker.png',
    scaledSize: { width: 40, height: 40 },
    origin: { x: 0, y: 0 },
    anchor: { x: 20, y: 40 }
  },
  DELIVERY_LOCATION: {
    url: '/icons/delivery-marker.png',
    scaledSize: { width: 40, height: 40 },
    origin: { x: 0, y: 0 },
    anchor: { x: 20, y: 40 }
  },
  DRIVER: {
    url: '/icons/driver-marker.png',
    scaledSize: { width: 30, height: 30 },
    origin: { x: 0, y: 0 },
    anchor: { x: 15, y: 15 }
  },
  DRIVER_MOVING: {
    url: '/icons/driver-moving.png',
    scaledSize: { width: 30, height: 30 },
    origin: { x: 0, y: 0 },
    anchor: { x: 15, y: 15 }
  }
};