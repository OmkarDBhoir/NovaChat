export interface User {
    id: string;
    username: string;
    email: string;
    status: string;
    createdAt: string;
}

export interface UserSearchResult {
    id: string;
    username: string;
    status: string;
}