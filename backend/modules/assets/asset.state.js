export const ALLOWED_TRANSITIONS = {
  stored: ['in_transit', 'vaulted'],
  in_transit: ['delivered', 'vaulted'],
  vaulted: ['in_transit'],
  delivered: []
};

export const canTransition = (from, to) => {
  return ALLOWED_TRANSITIONS[from]?.includes(to);
};