const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}

export const api = {
    getStatus: () => request('/api/status'),
    getUsers: () => request('/api/users'),
    createUser: (data) =>
        request('/api/create-user', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
