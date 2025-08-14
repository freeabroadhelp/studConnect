import { useCallback } from 'react';
import { API_URL } from '../config';

interface ApiError extends Error { status?: number; }

export function useApi(token?: string | null) {
	const request = useCallback(async <T>(path: string, options: RequestInit = {}): Promise<T> => {
		const res = await fetch(`${API_URL}${path}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				...(options.headers || {})
			}
		});
		if (!res.ok) {
			let message: any;
			try { message = await res.json(); } catch { message = await res.text(); }
			const err: ApiError = new Error(message?.detail || message || `Request failed (${res.status})`);
			err.status = res.status;
			throw err;
		}
		if (res.status === 204) return undefined as T;
		return res.json();
	}, [token]);

	return {
		get: <T>(path: string) => request<T>(path),
		post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
		patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
	};
}
