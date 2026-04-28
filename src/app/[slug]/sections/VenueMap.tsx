'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ArtistPalette } from '@/types'
import type { LiveConfig } from '@/types/sections'

type Venue = LiveConfig['venues'][0]

function AutoFit({ venues }: { venues: Venue[] }) {
  const map = useMap()
  useEffect(() => {
    if (venues.length === 0) return
    if (venues.length === 1) {
      map.setView([venues[0].lat!, venues[0].lng!], 6)
    } else {
      const bounds = L.latLngBounds(venues.map(v => [v.lat!, v.lng!] as [number, number]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, venues])
  return null
}

interface Props {
  venues:  Venue[]
  palette: ArtistPalette
}

export default function VenueMap({ venues, palette }: Props) {
  const mapped = venues.filter(v => v.lat != null && v.lng != null)
  if (mapped.length === 0) return null

  const center: [number, number] = [mapped[0].lat!, mapped[0].lng!]

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden"
      style={{ height: 420, border: `1px solid ${palette.border}` }}>

      {/* Dark map style overrides */}
      <style>{`
        .leaflet-container { background: #0a0a0e; }
        .leaflet-popup-content-wrapper {
          background: #141418;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          padding: 0;
        }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip { background: #141418; }
        .leaflet-control-attribution { display: none; }
        .leaflet-control-zoom a {
          background: #141418 !important;
          color: rgba(255,255,255,0.6) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1e1e24 !important;
          color: white !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <AutoFit venues={mapped} />

        {mapped.map(v => (
          <CircleMarker
            key={v.id}
            center={[v.lat!, v.lng!]}
            radius={9}
            pathOptions={{
              color:       palette.primary,
              fillColor:   palette.primary,
              fillOpacity: 0.9,
              weight:      2,
            }}
          >
            <Popup closeButton={false} offset={[0, -4]}>
              <div style={{ padding: '10px 14px', minWidth: 130 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#f5f5f5', marginBottom: 3 }}>{v.name}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                  {[v.city, v.country].filter(Boolean).join(', ')}
                </p>
                {v.date && (
                  <p style={{ fontSize: 11, color: palette.primary, marginTop: 4, fontFamily: 'monospace' }}>
                    {formatDate(v.date)}
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Pulse ring on each marker (CSS only) */}
      <style>{`
        @keyframes markerPulse {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
