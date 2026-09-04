// Restaurant location data with GPS coordinates for delivery booking
// These coordinates are needed for Porter/Rapido pickup addresses

export interface RestaurantLocation {
  id: string;
  name: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  mapsUrl: string;
}

export const restaurantLocations: RestaurantLocation[] = [
  {
    id: "begumpet",
    name: "White House, Begumpet",
    area: "Begumpet, Hyderabad",
    address: "White House, Begumpet, Hyderabad, Telangana 500016",
    lat: 17.4435,
    lng: 78.4614,
    phone: "+919000000000", // Replace with actual phone
    hours: "11:00 AM – 11:00 PM",
    mapsUrl: "https://g.co/kgs/vnGRcCx",
  },
  {
    id: "secunderabad",
    name: "Diamond Point, Secunderabad",
    area: "Diamond Point, Secunderabad",
    address: "Diamond Point, Secunderabad, Hyderabad, Telangana 500003",
    lat: 17.4399,
    lng: 78.4987,
    phone: "+919000000000", // Replace with actual phone
    hours: "11:00 AM – 11:00 PM",
    mapsUrl: "https://share.google/3yYBB0cfnB4nEXVyx",
  },
  {
    id: "marredpally",
    name: "Central Kitchen / Cloud Kitchen",
    area: "Marredpally, Hyderabad",
    address: "Marredpally, Secunderabad, Hyderabad, Telangana 500026",
    lat: 17.4526,
    lng: 78.4953,
    phone: "+919000000000", // Replace with actual phone
    hours: "10:00 AM – 11:00 PM",
    mapsUrl: "https://g.co/kgs/1UcQZJu",
  },
];

export function getLocationById(id: string): RestaurantLocation | undefined {
  return restaurantLocations.find((loc) => loc.id === id);
}
