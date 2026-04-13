export const ALLOWED_SHIPMENT_TRANSITIONS = {
  pending: ['in_transit', 'cancelled'],
  in_transit: ['arrived'],
  arrived: ['completed'],
  completed: [],
  cancelled: []
};

export const canTransitionShipment = (from, to) => {
  return ALLOWED_SHIPMENT_TRANSITIONS[from]?.includes(to);
};