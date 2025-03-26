import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const SafetyZones = ({ location }) => {
  const [safetyZones, setSafetyZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;

    const fetchSafetyZones = async () => {
      try {
        const query = `[out:json];
        (
          node["amenity"="police"](around:5000, ${location.latitude}, ${location.longitude});
          node["amenity"="hospital"](around:5000, ${location.latitude}, ${location.longitude});
          node["amenity"="fire_station"](around:5000, ${location.latitude}, ${location.longitude});
        );
        out;`;

        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.elements) {
          setSafetyZones(data.elements);
        } else {
          setSafetyZones([]);
        }
      } catch (error) {
        console.error("Error fetching safety zones:", error);
        setSafetyZones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyZones();
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛑 Nearby Safety Zones</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff4d4d" />
      ) : safetyZones.length === 0 ? (
        <Text style={styles.infoText}>No safety zones found nearby.</Text>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {safetyZones.map((zone, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: zone.lat, longitude: zone.lon }}
                title={zone.tags.name || "Unknown"}
                description={zone.tags.amenity}
              />
            ))}
          </MapView>

          <FlatList
            data={safetyZones}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.zoneItem}>
                <Text style={styles.zoneTitle}>{item.tags.name || "Unknown"}</Text>
                <Text style={styles.zoneType}>{item.tags.amenity}</Text>
                <Text style={styles.zoneCoords}>📍 {item.lat}, {item.lon}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#ff4d4d",
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#777",
  },
  zoneItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  zoneTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  zoneType: {
    fontSize: 16,
    color: "#555",
  },
  zoneCoords: {
    fontSize: 14,
    color: "#777",
  },
});

export default SafetyZones;
