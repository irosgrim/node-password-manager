export interface Secret {
    id: number;
    label: string;
    secret: string;
    user_id: number;
    date_created: Date, 
    date_modified: Date, 
    icon: string, 
    category: string;
    attachments: string[] | null;
}