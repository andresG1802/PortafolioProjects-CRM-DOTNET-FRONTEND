export type UserRole = 'Admin' | 'SalesRep';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted';
export type DealStage = 'Prospecting' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type ActivityType = 'Call' | 'Meeting' | 'Email' | 'Task';
export type ActivityStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
}

export interface Customer {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    address?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    customerId: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
}

export interface Lead {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    source?: string | null;
    status: LeadStatus;
    assignedToUserId?: string | null;
    createdAt: string;
}

export interface Deal {
    id: string;
    title: string;
    customerId: string;
    value: number;
    stage: DealStage;
    expectedCloseDate?: string | null;
    assignedToUserId?: string | null;
    createdAt: string;
}

export interface Activity {
    id: string;
    title: string;
    description?: string | null;
    type: ActivityType;
    status: ActivityStatus;
    dueDate?: string | null;
    customerId?: string | null;
    leadId?: string | null;
    dealId?: string | null;
    assignedToUserId?: string | null;
    createdAt: string;
}

export interface Note {
    id: string;
    content: string;
    customerId?: string | null;
    leadId?: string | null;
    dealId?: string | null;
    createdByUserId?: string | null;
    createdAt: string;
}

export interface DashboardSummary {
    totalCustomers: number;
    totalContacts: number;
    totalLeads: number;
    leadsByStatus: Record<string, number>;
    totalDeals: number;
    openDealsValue: number;
    wonDealsValue: number;
    dealsByStage: Record<string, number>;
    pendingActivities: number;
    overdueActivities: number;
}

export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export type CustomerPayload = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
export type ContactPayload = Omit<Contact, 'id' | 'customerId'> & { id?: string; customerId?: string };
export type LeadPayload = Omit<Lead, 'id' | 'createdAt'> & { id?: string };
export type DealPayload = Omit<Deal, 'id' | 'createdAt' | 'customerId'> & { id?: string; customerId?: string };
export type ActivityPayload = Omit<Activity, 'id' | 'createdAt'> & { id?: string };
export type NotePayload = Omit<Note, 'id' | 'createdAt' | 'createdByUserId'>;
