const artifactProfiles = [
  {
    match: 'SIEMENS',
    mode: 'analytics',
    index: 'A-01',
    title: 'USER-JOURNEY PIPELINE',
    signal: '400K+ USER SESSIONS',
    note: 'Session events flow into reconstructed journeys, behavioral clusters, and product insight.',
  },
  {
    match: 'INDEPENDENT HIGH AUTHORITY',
    mode: 'operations',
    index: 'A-02',
    title: 'SECURE OPERATIONS TOPOLOGY',
    signal: '100+ STAFF ONBOARDED',
    note: 'Protected servers coordinate maintained software, staff endpoints, inventory, and live IT operations.',
  },
  {
    match: 'BASIRA',
    mode: 'federated',
    index: 'A-03',
    title: 'FEDERATED TRAINING ROUND',
    signal: 'PRIVACY-PRESERVING ML',
    note: 'Private data stays with each client. Only model snapshots reach the aggregator; an updated global model returns for the next round.',
  },
  {
    match: 'MAKE IT HAPPEN',
    mode: 'commerce',
    index: 'A-04',
    title: 'E-COMMERCE REQUEST FLOW',
    signal: 'END-TO-END DELIVERY',
    note: 'A customer interaction moves through storefront, catalog, cart state, and a completed order.',
  },
];

export function getExperienceArtifactProfile(company = '', index = 0) {
  return artifactProfiles.find((profile) => company.includes(profile.match)) || {
    mode: 'analytics',
    index: `A-${String(index + 1).padStart(2, '0')}`,
    title: 'EXPERIENCE SIGNAL',
    signal: 'ACTIVE TIMELINE NODE',
    note: 'A responsive wireframe representation of this role and its impact.',
  };
}
