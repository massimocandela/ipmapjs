# IPmap.js

IPmap.js is a utility for interacting with the RIPE IPmap service offered by RIPE NCC.
With this library you can ask for the geolocation of an IP, verify if an IP is part of an IXP peering lan, check where (IXPs and facilities) where an IP is peering. 
The library is developed in JS and can be used both on Node.js or in the browser. 

## Geolocation format

The geolocation format provided by RIPE IPmap is:

```jsson
{
    "score": 126,
    "geofeed": "1.2.3.4,NL,NL-07,Amsterdam,",
    "countryCodeAlpha3": "NLD",
    "countryCodeAlpha2": "NL",
    "cityPopulation": 741636,
    "stateAnsiCode": "07",
    "pointGeometry": "0101000020E61000001E5036E50A8F134087DC0C37E02F4A40",
    "cityNameAscii": "Amsterdam",
    "stateIsoCode": "NL-07",
    "countryName": "Netherlands",
    "stateName": "North Holland",
    "longitude": 4.88969,
    "geonameId": 2759794,
    "latitude": 52.37403,
    "cityName": "Amsterdam",
    "type": "city",
    "id": "AMSTERDAM-NL-07-U173ZQ2SF4C47GPE4JPJ"
}
```

## Quick Guide

|Command| Input | Description| Expected output| 
|---|---|---|---|
|getGeolocation| A string ("123.6.225.1") or an array of strings (["123.6.225.1", "12.6.22.1"]) for a more efficient querying| It returns the geolocation of the provided IPs| If you provide a string, you will get the location. If you provide an array, you will get back a dictionary of <IP, location> pairs. If RIPE IPmap doesn't have a geolocation for a given IP, or if the IP is anycast, the output for that IP will be "null"|
|isAnycast| A string ("123.6.225.1") or an array of strings (["123.6.225.1", "12.6.22.1"]) for a more efficient querying| It returns a boolean (or null) for each of the provided IPs, each of which identifying if the IP is anycast or not.| If you provide a string, you will get a single boolean. If you provide an array, you will get back a dictionary of <IP, boolean> pairs. If RIPE IPmap doesn't have an answer for a given IP, the value for that IP will be "null"|
|||||
|||||
|||||
|||||
|||||
|||||
|||||
|||||
|||||
|||||

