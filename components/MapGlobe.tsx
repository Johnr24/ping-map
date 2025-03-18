'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { calculateTheoreticalPingTime, formatPingTime, calculateGreatCircleDistance } from '@/utils/pingCalculator'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function MapGlobe() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const pointsRef = useRef<Array<[number, number]>>([])
  const [pingTime, setPingTime] = useState<string>('N/A')
  const markerCountRef = useRef<number>(0) // Add counter for total markers placed
  
  // Initialize map
  useEffect(() => {
    if (map.current) return // Only initialize once
    
    if (mapContainer.current) {
      // Create the map with a standard style
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [0, 0],
        zoom: 1,
        pitch: 0,
        bearing: 0
      })
      
      // Set dark background for the map
      mapContainer.current.style.background = '#000'
      
      // Add navigation control
      map.current.addControl(new maplibregl.NavigationControl())
      
      // Add attribution
      map.current.addControl(new maplibregl.AttributionControl({
        customAttribution: '© OpenStreetMap contributors'
      }), 'bottom-right')
      
      // Add click handler for adding markers
      map.current.on('click', (e) => {
        console.log('Map clicked at:', e.lngLat)
        const { lng, lat } = e.lngLat
        console.log(`Adding marker at: lng=${lng}, lat=${lat}`)
        addMarker(lng, lat)
      })
      
      // Add debug listener for map load
      map.current.on('load', () => {
        console.log('Map loaded')
        // Set globe projection after map is loaded
        map.current?.setProjection({
          type: 'globe'
        })
        console.log('Globe projection set')
      })
      
      // Add debug listener for style load
      map.current.on('style.load', () => {
        console.log('Map style loaded')
      })
    }
    
    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove())
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])
  
  // Function to add a marker at the specified coordinates
  const addMarker = (lng: number, lat: number) => {
    if (!map.current) return
    
    console.log('Adding marker at:', [lng, lat])
    
    // Manage markers directly with refs instead of state
    // If we already have 2 markers, remove the first one
    if (markersRef.current.length >= 2) {
      const oldMarker = markersRef.current.shift()
      oldMarker?.remove()
      pointsRef.current.shift()
    }
    
    // Increment the counter each time a new marker is added
    markerCountRef.current += 1
    
    // Determine color based on position (odd or even)
    const markerColor = markerCountRef.current % 2 === 1 ? '#ff3b30' : '#007aff' // Red for odd, blue for even
    
    // Create marker element
    const el = document.createElement('div')
    el.className = 'marker'
    el.style.backgroundColor = markerColor
    
    console.log(`Adding ${markerColor === '#ff3b30' ? 'red' : 'blue'} marker, count: ${markerCountRef.current}`)
    
    // Create and add the marker
    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat([lng, lat])
      .addTo(map.current)
    
    // Add to our refs
    markersRef.current.push(marker)
    pointsRef.current.push([lat, lng] as [number, number])
    
    console.log('Current markers count:', markersRef.current.length)
    console.log('Current points:', pointsRef.current)
    
    // Draw line between points if we have exactly two
    if (markersRef.current.length === 2) {
      console.log('We have 2 markers, drawing line and calculating ping')
      drawRouteAndCalculatePing(pointsRef.current)
    } else {
      // Remove existing line if present
      if (map.current.getSource('route')) {
        try {
          map.current.removeLayer('route-line')
          map.current.removeLayer('route-glow')
          map.current.removeSource('route')
        } catch (e) {
          console.error('Error removing existing layers:', e)
        }
      }
    }
  }
  
  // Separate function to draw route and calculate ping
  const drawRouteAndCalculatePing = (routePoints: [number, number][]) => {
    if (!map.current || routePoints.length !== 2) return
    
    // Get coordinates in correct format for calculations
    const [lat1, lng1] = routePoints[0]
    const [lat2, lng2] = routePoints[1]
    
    console.log('Calculating ping time between:', 
      `Point 1: ${lat1}, ${lng1}`,
      `Point 2: ${lat2}, ${lng2}`
    )
    
    const time = calculateTheoreticalPingTime(lat1, lng1, lat2, lng2)
    const distance = calculateGreatCircleDistance(lat1, lng1, lat2, lng2)
    
    console.log('Calculated values:', { time, distance })
    
    // Format the ping time
    const formattedTime = formatPingTime(time)
    setPingTime(formattedTime)
    
    // Remove existing line if present
    if (map.current.getSource('route')) {
      try {
        map.current.removeLayer('route-line')
        map.current.removeLayer('route-glow')
        map.current.removeSource('route')
      } catch (e) {
        console.error('Error removing existing layers:', e)
      }
    }
    
    // Add the new line source with coordinates in [lng, lat] format for GeoJSON
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [lng1, lat1], // GeoJSON uses [longitude, latitude] order
            [lng2, lat2]
          ]
        }
      }
    })
    
    console.log('Added route source with coordinates:', [
      [lng1, lat1],
      [lng2, lat2]
    ])
    
    // Add the glow layer first
    map.current.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#4db8ff',
        'line-width': 15,
        'line-opacity': 0.8,
        'line-blur': 15
      }
    })
    
    console.log('Added glow layer')
    
    // Add the main line layer on top
    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 5,
        'line-opacity': 1,
        'line-dasharray': [0.5, 1]
      }
    })
    
    console.log('Added line layer')
    
    // Calculate midpoint for popup
    const midLat = (lat1 + lat2) / 2
    const midLng = (lng1 + lng2) / 2
    
    // Remove existing popups
    const existingPopups = document.getElementsByClassName('ping-popup')
    Array.from(existingPopups).forEach(popup => popup.remove())
    
    // Add the ping time popup
    new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'ping-popup',
      anchor: 'center'
    })
      .setLngLat([midLng, midLat])
      .setHTML(`
        <div class="text-center p-2">
          <div class="font-bold text-lg text-blue-400">${formattedTime}</div>
          <div class="text-sm">Distance: ${distance.toFixed(0)} km</div>
        </div>
      `)
      .addTo(map.current)
    
    console.log('Added popup with ping time:', formattedTime)
  }
  
  return (
    <>
      <div className="instructions absolute top-4 left-4 z-10 bg-black/70 p-4 rounded-lg text-white max-w-md">
        <h3 className="text-xl font-bold mb-2">Instructions:</h3>
        <p>Click on two different locations on the globe to calculate the theoretical minimum ping time between them.</p>
        
        <div className="mt-4 p-2 bg-gray-800 rounded">
          <span>Theoretical Minimum Ping Time: </span>
          <span className="font-bold text-xl text-blue-400">{pingTime}</span>
        </div>
      </div>
      
      <div 
        ref={mapContainer} 
        className="map-container" 
        style={{ width: '100%', height: '100vh' }} 
      />
    </>
  )
} 