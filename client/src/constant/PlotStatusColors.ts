// Plot Status Color Mapping
export const PLOT_STATUS_COLORS: Record<string, string> = {
  OPEN: '#00FF00',           // Green - Open/Available
  AVAILABLE: '#00FF00',      // Green
  A: '#00FF00',              // Green - Available
  BOOKED: '#0000FF',         // Blue - Booked
  B: '#0000FF',              // Blue - Booked
  SOLD: '#FF0000',           // Red - Sold
  S: '#FF0000',              // Red - Sold
  HELD: '#FFFF00',           // Yellow - On Hold/Blocked
  H: '#FFFF00',              // Yellow - Held
  NEGOTIATION: '#00FFFF',    // Cyan - Negotiation
  N: '#00FFFF',              // Cyan - Negotiation
  UNAVAILABLE: '#FF0000',    // Red
  PENDING: '#FFA500',        // Orange - Pending
};

export const PLOT_STATUS_DISPLAY: Record<string, { color: string; label: string }> = {
  OPEN: { color: '#00FF00', label: 'Open' },
  BOOKED: { color: '#0000FF', label: 'Booked' },
  SOLD: { color: '#FF0000', label: 'Sold' },
  HELD: { color: '#FFFF00', label: 'On Hold' },
  NEGOTIATION: { color: '#00FFFF', label: 'Negotiation' },
  AVAILABLE: { color: '#00FF00', label: 'Available' },
  UNAVAILABLE: { color: '#FF0000', label: 'Unavailable' },
  PENDING: { color: '#FFA500', label: 'Pending' },
};

export const getStatusColor = (status: string): string => {
  return PLOT_STATUS_COLORS[status?.toUpperCase()] || '#CCCCCC'; // Gray as default
};

export const getStatusLabel = (status: string): { color: string; label: string } => {
  return (
    PLOT_STATUS_DISPLAY[status?.toUpperCase()] || {
      color: '#CCCCCC',
      label: 'Unknown',
    }
  );
};
