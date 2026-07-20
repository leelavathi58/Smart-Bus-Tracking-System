import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Tooltip,
    Polyline,
    useMap
} from "react-leaflet";

import { useEffect, useState } from "react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function ChangeView({ center }) {

    const map = useMap();

    useEffect(() => {

        if (center[0] && center[1]) {

            map.flyTo(center, map.getZoom(), {
                animate: true,
                duration: 1
            });

        }

    }, [center, map]);

    return null;
}


function BusMap({
    latitude,
    longitude,
    busName,
    busStops = [] 
}) {

    

    

    const lat = parseFloat(latitude);
const lng = parseFloat(longitude);

const position = [Number(latitude), Number(longitude)];
    console.log("BusMap Position:", position);
    console.log("Latitude:", latitude);
console.log("Longitude:", longitude);
console.log("Position =", position);

const routeCoordinates = busStops.map(stop => [
    stop.latitude,
    stop.longitude
]);

    return (

        <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            style={{
                height: "500px",
                width: "100%",
                borderRadius: "16px"
            }}
        >

            <ChangeView center={position} />

            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

{routeCoordinates.length > 1 && (
    <Polyline
        positions={routeCoordinates}
        pathOptions={{
            color: "blue",
            weight: 5
        }}
    />
)}



   {!isNaN(lat) && !isNaN(lng) && (
    <Marker position={position}>
        <Popup>{busName}</Popup>
    </Marker>

    
)}

{
    busStops?.map(stop => (

        <Marker
            key={stop.id}
            position={[
                stop.latitude,
                stop.longitude
            ]}
        >

            <Tooltip
                permanent
                direction="top"
                offset={[0, -12]}
            >
                🛑 {stop.stopName}
            </Tooltip>

            <Popup>

                <strong>{stop.stopName}</strong>

                <br />

                Latitude: {stop.latitude}

                <br />

                Longitude: {stop.longitude}

            </Popup>

        </Marker>

    ))
}

        </MapContainer>

    );

}

export default BusMap;