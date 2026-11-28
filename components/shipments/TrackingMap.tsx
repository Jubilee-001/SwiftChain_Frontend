'use client';

import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTrackingRoute } from '@/hooks/useTrackingRoute';
import { calculateDistanceKm } from '@/services/geofenceService';
import { Coordinate, MapBounds, RouteData } from '@/types/tracking';
import { AlertCircle, Loader2, Package } from 'lucide-react';

const DEFAULT_AVERAGE_SPEED_KMH = 40;

export interface TrackingMapProps {
  deliveryId: string | null;
  className?: string;
  height?: string;
  showControls?: boolean;
  onMapError?: (_error: string) => void;
}

// Leaflet reads browser globals when its module loads.
export const TrackingMap = dynamic(() => import('./TrackingMapClient'), {
  ssr: false,
});

export default TrackingMap;
