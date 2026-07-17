import { ActivityType, DealStage, LeadStatus } from '../types';

export const formatDate = (date?: string | Date | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (date?: string | Date | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatCurrency = (amount?: number | null): string => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount ?? 0);
};

export const toDateInputValue = (date?: string | Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
};

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];
export const DEAL_STAGES: DealStage[] = ['Prospecting', 'Proposal', 'Negotiation', 'Won', 'Lost'];
export const ACTIVITY_TYPES: ActivityType[] = ['Call', 'Meeting', 'Email', 'Task'];

export const getInitials = (name?: string | null): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2);
    return initials.toUpperCase();
};

// FastEndpoints validation errors come back as { statusCode, message, errors: { field: string[] } }
export const getApiErrorMessage = (error: any, fallback: string): string => {
    const errors = error?.response?.data?.errors;
    if (errors) {
        const firstField = Object.values(errors)[0];
        if (Array.isArray(firstField) && firstField[0]) return firstField[0] as string;
    }
    return error?.response?.data?.message || fallback;
};
