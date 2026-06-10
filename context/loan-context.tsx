import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoanOffer {
  id: string;
  lenderName: string;
  amount: number;
  interestRate: number;
  tenure: number; // days
  description: string;
  status: 'active' | 'funded' | 'closed';
  createdAt: string;
  applicants: number;
  location: string;
  rating: number;
}

export interface LoanRequest {
  id: string;
  offerId: string;
  lenderName: string;
  borrowerName: string;
  amount: number;
  tenure: number;
  interestRate: number;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface LoanContextType {
  offers: LoanOffer[];
  requests: LoanRequest[];
  postOffer: (offer: Omit<LoanOffer, 'id' | 'createdAt' | 'applicants' | 'rating' | 'status'>) => void;
  requestLoan: (request: Omit<LoanRequest, 'id' | 'createdAt' | 'status'>) => void;
  closeOffer: (id: string) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

// Initial dummy data for Loan context
const INITIAL_OFFERS: LoanOffer[] = [
  {
    id: '1',
    lenderName: 'Alice Finance',
    amount: 50000,
    interestRate: 12,
    tenure: 30,
    description: 'Personal loan for medical emergencies',
    status: 'active',
    createdAt: '2026-06-01',
    applicants: 2,
    location: 'Mumbai',
    rating: 4.8,
  },
  {
    id: '2',
    lenderName: 'Bob Lending',
    amount: 100000,
    interestRate: 15,
    tenure: 90,
    description: 'Business expansion loan',
    status: 'active',
    createdAt: '2026-06-02',
    applicants: 5,
    location: 'Delhi',
    rating: 4.5,
  }
];

const INITIAL_REQUESTS: LoanRequest[] = [
  {
    id: 'req_1',
    offerId: '1',
    lenderName: 'Alice Finance',
    borrowerName: 'Dummy User',
    amount: 50000,
    tenure: 30,
    interestRate: 12,
    note: 'Need for hospital bills',
    status: 'pending',
    createdAt: '2026-06-03',
  }
];

export function LoanProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<LoanOffer[]>(INITIAL_OFFERS);
  const [requests, setRequests] = useState<LoanRequest[]>(INITIAL_REQUESTS);

  const postOffer = (newOfferData: Omit<LoanOffer, 'id' | 'createdAt' | 'applicants' | 'rating' | 'status'>) => {
    const newOffer: LoanOffer = {
      ...newOfferData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      applicants: 0,
      rating: 4.5 + Math.random() * 0.5, // dynamic nice rating
    };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const requestLoan = (newRequestData: Omit<LoanRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: LoanRequest = {
      ...newRequestData,
      id: 'req_' + Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    // Update requests
    setRequests((prev) => [newRequest, ...prev]);

    // Update applicant count on the offer
    setOffers((prevOffers) =>
      prevOffers.map((o) =>
        o.id === newRequestData.offerId ? { ...o, applicants: o.applicants + 1 } : o
      )
    );
  };

  const closeOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'closed' } : o))
    );
  };

  const updateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <LoanContext.Provider
      value={{
        offers,
        requests,
        postOffer,
        requestLoan,
        closeOffer,
        updateRequestStatus,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
}

export function useLoans() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoans must be used within LoanProvider');
  return ctx;
}
