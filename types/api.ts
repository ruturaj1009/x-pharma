export interface ApiResponse<T = unknown> {
    status: number;
    message?: string; // Helpful to have a message alongside status
    data?: T;
    error?: string | object;
    metadata?: Record<string, any>;
}
