import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

export interface User { id:number; email:string; full_name?:string|null; role:'student'|'counsellor'; }

interface AuthContextValue {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email:string, password:string) => Promise<void>;
	register: (email:string, password:string, role:'student'|'counsellor', full_name?:string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('sc_token'));
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const api = useApi(token);

	// Fetch current user when token changes
	useEffect(() => {
		let cancelled = false;
		if (token) {
			api.get<User>('/users/me').then(u => { if(!cancelled) setUser(u); }).catch(() => { if(!cancelled) setUser(null); });
		} else {
			setUser(null);
		}
		return () => { cancelled = true; };
	}, [token]);

	async function login(email:string, password:string) {
		setLoading(true);
		try {
			const { access_token } = await api.post<{access_token:string}>('/auth/login', { email, password });
			setToken(access_token); localStorage.setItem('sc_token', access_token);
			const me = await api.get<User>('/users/me'); setUser(me);
		} finally { setLoading(false); }
	}

	async function register(email:string, password:string, role:'student'|'counsellor', full_name?:string) {
		setLoading(true);
		try {
			await api.post<User>('/auth/register', { email, password, role, full_name });
			// Auto-login
			await login(email, password);
		} finally { setLoading(false); }
	}

	function logout() { setToken(null); localStorage.removeItem('sc_token'); setUser(null); }

	return (
		<AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};
