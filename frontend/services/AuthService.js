export class AuthService {
    static async login({ username, password }) {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success && data.token) localStorage.setItem("token", data.token);
        return data;
    }

    static async verifyToken() {
        const res = await fetch("/auth/verify");
        const data = await res.json();
        return data.valid;
    }

    static logout() {
        localStorage.removeItem("token");
    }
}
