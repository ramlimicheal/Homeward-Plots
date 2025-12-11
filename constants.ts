import { Property } from './types';

// Mock Properties
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-101',
    title: 'Serene Lakefront Plot - Whitefield',
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      district: 'Whitefield',
      coordinates: [12.9698, 77.7500]
    },
    price: {
      inr: 12500000,
      usd: 150000,
      pricePerSqFt: 5200
    },
    specs: {
      area: 2400,
      dimensions: '40x60',
      facing: 'North-East',
      zoning: 'Residential (Yellow Zone)'
    },
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3'
    ],
    description: 'A premium verified plot located in the heart of Whitefield IT corridor. Perfect for building a luxury villa. Clear titles with 30-year link documents available.',
    documents: [
      { name: 'Sale Deed (Mother Deed)', verified: true, dateVerified: '2023-11-15', type: 'critical' },
      { name: 'Encumbrance Certificate (15 Years)', verified: true, dateVerified: '2023-12-01', type: 'critical' },
      { name: 'Khata Certificate', verified: true, dateVerified: '2023-11-20', type: 'standard' },
      { name: 'Property Tax Receipts', verified: false, type: 'standard' }
    ],
    partner: {
      name: 'Ramesh & Associates Legal',
      role: 'Verified Legal Partner',
      verified: true,
      rating: 4.9
    },
    priceHistory: [
      { year: '2019', price: 3800 },
      { year: '2020', price: 4100 },
      { year: '2021', price: 4400 },
      { year: '2022', price: 4800 },
      { year: '2023', price: 5200 }
    ],
    verificationLevel: 'Platinum',
    status: 'Available'
  },
  {
    id: 'prop-102',
    title: 'Gated Community Plot - Gachibowli',
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      district: 'Ranga Reddy',
      coordinates: [17.4401, 78.3489]
    },
    price: {
      inr: 25000000,
      usd: 300000,
      pricePerSqFt: 8333
    },
    specs: {
      area: 3000,
      dimensions: '50x60',
      facing: 'West',
      zoning: 'Residential'
    },
    images: [
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=5',
      'https://picsum.photos/800/600?random=6'
    ],
    description: 'Exclusive plot in a high-security gated community. Close to Financial District. Valid HMDA approval.',
    documents: [
      { name: 'HMDA Approval', verified: true, dateVerified: '2024-01-10', type: 'critical' },
      { name: 'Link Documents', verified: true, dateVerified: '2024-01-12', type: 'critical' },
      { name: 'Encumbrance Certificate', verified: true, dateVerified: '2024-01-15', type: 'standard' }
    ],
    partner: {
      name: 'SafeLand Consultants',
      role: 'Verified Agent',
      verified: true,
      rating: 4.7
    },
    priceHistory: [
      { year: '2019', price: 5000 },
      { year: '2020', price: 5500 },
      { year: '2021', price: 6200 },
      { year: '2022', price: 7100 },
      { year: '2023', price: 8333 }
    ],
    verificationLevel: 'Gold',
    status: 'Under Offer'
  },
  {
    id: 'prop-103',
    title: 'Sea View Estate - ECR',
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      district: 'Kanchipuram',
      coordinates: [12.8996, 80.2209]
    },
    price: {
      inr: 8500000,
      usd: 102000,
      pricePerSqFt: 3500
    },
    specs: {
      area: 2428, // ~5.5 cents
      dimensions: 'Irregular',
      facing: 'East',
      zoning: 'Farm Land/Res'
    },
    images: [
      'https://picsum.photos/800/600?random=7',
      'https://picsum.photos/800/600?random=8'
    ],
    description: 'Scenic plot near the beach on East Coast Road. Ideal for a holiday home or investment. Patta is available.',
    documents: [
      { name: 'Patta/Chitta', verified: true, dateVerified: '2023-09-01', type: 'critical' },
      { name: 'Title Deed', verified: true, dateVerified: '2023-09-01', type: 'critical' },
      { name: 'NOC from Coastal Authority', verified: false, type: 'critical' }
    ],
    partner: {
      name: 'Chennai Legal Experts',
      role: 'Legal Partner',
      verified: true,
      rating: 4.5
    },
    priceHistory: [
      { year: '2019', price: 2100 },
      { year: '2020', price: 2300 },
      { year: '2021', price: 2700 },
      { year: '2022', price: 3100 },
      { year: '2023', price: 3500 }
    ],
    verificationLevel: 'Basic',
    status: 'Available'
  }
];

export const STATES_LIST = [
  "Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", "Kerala", "Gujarat"
];