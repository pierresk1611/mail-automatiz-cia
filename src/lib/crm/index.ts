import type { appSettings } from "@/lib/db/schema";

export interface CRMOrder {
    id: string;
    customerEmail: string;
    status: string;
    total: number;
    currency: string;
    items: Array<{ name: string; quantity: number }>;
}

export interface CRMService {
    getOrder(orderId: string): Promise<CRMOrder | null>;
    getOrdersByEmail(email: string): Promise<CRMOrder[]>;
    updateOrderStatus(orderId: string, statusId: string): Promise<boolean>;
    getStatuses(): Promise<Array<{ id: string; name: string }>>;
}

// Mock Implementation
export class MockCRMService implements CRMService {
    private orders: CRMOrder[] = [
        {
            id: "1001",
            customerEmail: "jan.novak@example.com",
            status: "Processing",
            total: 150.0,
            currency: "EUR",
            items: [{ name: "Vizitky", quantity: 500 }],
        },
        {
            id: "1002",
            customerEmail: "peter.svoboda@example.cz",
            status: "Paid",
            total: 2500.0,
            currency: "CZK",
            items: [{ name: "Plachty", quantity: 2 }],
        },
    ];

    async getOrder(orderId: string): Promise<CRMOrder | null> {
        return this.orders.find((o) => o.id === orderId) || null;
    }

    async getOrdersByEmail(email: string): Promise<CRMOrder[]> {
        return this.orders.filter((o) => o.customerEmail === email);
    }

    async updateOrderStatus(orderId: string, statusId: string): Promise<boolean> {
        const order = this.orders.find((o) => o.id === orderId);
        if (!order) return false;
        order.status = statusId; // In real CRM, statusId would map to a name
        return true;
    }

    async getStatuses(): Promise<Array<{ id: string; name: string }>> {
        return [
            { id: "1", name: "Nová" },
            { id: "2", name: "Uhradená" },
            { id: "3", name: "Grafická úprava" },
            { id: "4", name: "Schválené na tlač" },
            { id: "5", name: "Odoslané" },
            { id: "6", name: "Storno" },
        ];
    }
}

// Factory to get the correct service (Mock or Real)
export function getCRMService(): CRMService {
    // In future, check env or settings to decide
    return new MockCRMService();
}
