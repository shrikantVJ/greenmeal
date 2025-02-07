// src/components/Admin/Campaigns.jsx
import React, { useState, useEffect } from "react";
import { StaticMap, Marker } from 'react-map-gl';  // Correct import for react-map-gl
import "mapbox-gl/dist/mapbox-gl.css";  // Ensure the Mapbox GL CSS is included
import { Leaf, Calendar, MapPin, DollarSign, Send, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Campaigns() {
  return (
    <div>
      <StaticMap
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 4
        }}
        style={{ width: '100%', height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker longitude={-100} latitude={40}>
          <div>📍</div>
        </Marker>
      </StaticMap>
    </div>
  );
}
