import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';

const WeatherAlertsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('New Delhi, India');
  const [weatherData, setWeatherData] = useState(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  // This is simulated data since we're not using a real weather API in this example
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockWeatherData = {
        current: {
          temp: 32,
          humidity: 65,
          wind_speed: 5.4,
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
              icon: '01d'
            }
          ]
        },
        alerts: [
          {
            id: '1',
            event: 'Heat Wave',
            description: 'Extreme heat conditions expected. Stay hydrated and avoid outdoor activities during peak hours.',
            start: Date.now(),
            end: Date.now() + 86400000, // 24 hours
            severity: 'high'
          },
          {
            id: '2',
            event: 'Air Quality Alert',
            description: 'Poor air quality. Sensitive groups should limit outdoor exposure.',
            start: Date.now(),
            end: Date.now() + 43200000, // 12 hours
            severity: 'medium'
          }
        ]
      };
      
      setWeatherData(mockWeatherData);
      setLoading(false);
    }, 1500);
  }, []);
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate refresh API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Updated', 'Weather alerts have been refreshed');
    }, 1000);
  };
  
  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    Alert.alert(
      alertsEnabled ? 'Alerts Disabled' : 'Alerts Enabled',
      alertsEnabled 
        ? 'You will no longer receive weather alerts' 
        : 'You will now receive weather alerts'
    );
  };
  
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high':
        return Theme.colors.danger;
      case 'medium':
        return Theme.colors.warning;
      default:
        return Theme.colors.info;
    }
  };
  
  const getWeatherIcon = (icon) => {
    switch(icon) {
      case '01d':
      case '01n':
        return 'sunny-outline';
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return 'partly-sunny-outline';
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return 'rainy-outline';
      case '11d':
      case '11n':
        return 'thunderstorm-outline';
      case '13d':
      case '13n':
        return 'snow-outline';
      case '50d':
      case '50n':
        return 'cloudy-outline';
      default:
        return 'cloud-outline';
    }
  };
  
  const renderAlert = ({ item }) => (
    <Card
      style={[styles.alertCard, { borderLeftColor: getSeverityColor(item.severity) }]}
    >
      <View style={styles.alertHeader}>
        <Text style={styles.alertTitle}>{item.event}</Text>
        <View style={[styles.severityTag, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>
            {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.alertDescription}>{item.description}</Text>
      <View style={styles.alertFooter}>
        <Text style={styles.alertTimeframe}>
          Valid for the next {item.severity === 'high' ? '24 hours' : '12 hours'}
        </Text>
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
            <Text style={styles.loadingText}>Loading weather information...</Text>
          </View>
        ) : (
          <>
            {/* Current Weather Card */}
            <Card style={styles.weatherCard}>
              <View style={styles.weatherHeader}>
                <View>
                  <Text style={styles.locationText}>{location}</Text>
                  <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
                <Ionicons 
                  name={getWeatherIcon(weatherData.current.weather[0].icon)} 
                  size={48} 
                  color={Theme.colors.primary} 
                />
              </View>
              
              <View style={styles.weatherDetails}>
                <View style={styles.temperature}>
                  <Text style={styles.tempValue}>{weatherData.current.temp}°C</Text>
                  <Text style={styles.weatherDescription}>
                    {weatherData.current.weather[0].description}
                  </Text>
                </View>
                
                <View style={styles.weatherMetrics}>
                  <View style={styles.metric}>
                    <Ionicons name="water-outline" size={20} color={Theme.colors.textLight} />
                    <Text style={styles.metricText}>{weatherData.current.humidity}%</Text>
                  </View>
                  <View style={styles.metric}>
                    <Ionicons name="speedometer-outline" size={20} color={Theme.colors.textLight} />
                    <Text style={styles.metricText}>{weatherData.current.wind_speed} m/s</Text>
                  </View>
                </View>
              </View>
            </Card>
            
            {/* Alerts Section */}
            <View style={styles.alertsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Weather Alerts</Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={handleRefresh}
                >
                  <Ionicons name="refresh" size={20} color={Theme.colors.primary} />
                </TouchableOpacity>
              </View>
              
              {weatherData.alerts.length > 0 ? (
                <FlatList
                  data={weatherData.alerts}
                  renderItem={renderAlert}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.alertsList}
                />
              ) : (
                <View style={styles.noAlertsContainer}>
                  <Ionicons name="checkmark-circle" size={48} color={Theme.colors.success} />
                  <Text style={styles.noAlertsText}>No weather alerts for your area</Text>
                </View>
              )}
            </View>
            
            {/* Settings */}
            <View style={styles.settingsContainer}>
              <Button
                title={alertsEnabled ? "Disable Weather Alerts" : "Enable Weather Alerts"}
                variant={alertsEnabled ? "outline" : "primary"}
                onPress={toggleAlerts}
                fullWidth
              />
              
              <TouchableOpacity style={styles.changeLocationButton}>
                <Ionicons name="location-outline" size={16} color={Theme.colors.primary} />
                <Text style={styles.changeLocationText}>Change Location</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.md,
  },
  weatherCard: {
    marginBottom: Theme.spacing.lg,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  dateText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
  },
  temperature: {
    flex: 1,
  },
  tempValue: {
    fontSize: 48,
    fontWeight: '200',
    color: Theme.colors.text,
  },
  weatherDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    textTransform: 'capitalize',
  },
  weatherMetrics: {
    borderLeftWidth: 1,
    borderLeftColor: Theme.colors.border,
    paddingLeft: Theme.spacing.md,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  metricText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  alertsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  refreshButton: {
    padding: Theme.spacing.xs,
  },
  alertsList: {
    paddingBottom: Theme.spacing.md,
  },
  alertCard: {
    marginBottom: Theme.spacing.md,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  alertTitle: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  severityTag: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  severityText: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.surface,
    fontWeight: '500',
  },
  alertDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  alertFooter: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: Theme.spacing.sm,
  },
  alertTimeframe: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  noAlertsText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  settingsContainer: {
    marginTop: Theme.spacing.md,
  },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  changeLocationText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.xs,
    fontWeight: '500',
  },
});

export default WeatherAlertsScreen; 