export interface DocumentStatus {
    name: string;
    verified: boolean;
    dateVerified?: string;
    type: 'critical' | 'standard';
  }
  
  export interface PriceHistory {
    year: string;
    price: number;
  }
  
  export interface Property {
    id: string;
    title: string;
    location: {
      city: string;
      state: string;
      district: string;
      coordinates: [number, number]; // lat, long
    };
    price: {
      inr: number;
      usd: number;
      pricePerSqFt: number;
    };
    specs: {
      area: number; // in sq ft
      dimensions: string;
      facing: string;
      zoning: string;
    };
    images: string[];
    description: string;
    documents: DocumentStatus[];
    partner: {
      name: string;
      role: string;
      verified: boolean;
      rating: number;
    };
    priceHistory: PriceHistory[];
    verificationLevel: 'Basic' | 'Gold' | 'Platinum';
    status: 'Available' | 'Under Offer' | 'Sold';
  }
  
  export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
    isThinking?: boolean;
  }
  
  export enum AppView {
    HOME = 'HOME',
    LISTING_DETAIL = 'LISTING_DETAIL',
    DASHBOARD = 'DASHBOARD',
    SERVICES = 'SERVICES'
  }
  
  export interface User {
    name: string;
    phone: string;
    isLoggedIn: boolean;
  }