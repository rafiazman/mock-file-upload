export interface Task {
    task_id: string;
    name: string;
    status: 'submitted' | 'processing' | 'success' | 'failure' | 'cancelled' | 'error';
    error?: string;
    file: File;
}