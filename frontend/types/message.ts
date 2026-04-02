
//メッセージに関する型定義

export interface Message{
    id: number;
    application_id: number;
    sender_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    sender: {
        id: number;
        name: string;
        role: string;
    };
}