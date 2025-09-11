import { env } from "@/config/env";
import { isTokenExpired } from "./jwt";

type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    cookie?: string;
    params?: Record<string, string | number | boolean | undefined | null>;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
    authRequired?: boolean;
};

async function refreshToken(): Promise<string | null> {
    try {
        const res = await fetch(`${env.API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include", // send refresh cookie
        });

        if (res.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        if (!res.ok) return null;

        const data = await res.json();
        const newToken = data.accessToken;

        // On client: persist it in cookie
        if (typeof window !== "undefined") {
            const { setCookie } = await import("cookies-next");
            setCookie("refreshToken", newToken, { path: "/" });
        }

        return newToken;
    } catch {
        return null;
    }
}

function buildUrlWithParams(
    url: string,
    params?: RequestOptions['params'],
): string {
    if (!params) return url;
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== null,
        ),
    );
    if (Object.keys(filteredParams).length === 0) return url;
    const queryString = new URLSearchParams(
        filteredParams as Record<string, string>,
    ).toString();
    return `${url}?${queryString}`;
}

export async function getServerCookies() {
    if (typeof window !== 'undefined') return '';

    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies(); // this is synchronous, no await needed
        return cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join('; ');
    } catch (error) {
        console.error('Failed to access cookies:', error);
        return '';
    }
}

async function fetchApi<T>(
    url: string,
    options: RequestOptions = {},
): Promise<T> {
    const {
        method = 'GET',
        headers = {},
        body,
        cookie,
        params,
        cache = 'no-store',
        next,
        authRequired = true
    } = options;

    let cookieHeader = cookie;
    if (typeof window === 'undefined' && !cookie) {
        cookieHeader = await getServerCookies();
    }

    let accessToken: string | undefined;

    if (authRequired) {
        if (typeof window === "undefined") {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            accessToken = cookieStore.get("accessToken")?.value;
        } else {
            const { getCookie } = await import("cookies-next");
            accessToken = getCookie("accessToken") as string | undefined;
        }

        if (!accessToken || isTokenExpired(accessToken)) {
            const newToken = await refreshToken();
            if (newToken) {
                accessToken = newToken;

                if (typeof window !== "undefined") {
                    const { setCookie } = await import("cookies-next");
                    setCookie("accessToken", accessToken, {
                        path: "/",
                        maxAge: 60 * 15,
                    });
                }
            } else {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                throw new Error("Session expired");
            }
        }
    }

    const fullUrl = buildUrlWithParams(`${env.API_URL}${url}`, params);

    const response = await fetch(fullUrl, {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
            ...(authRequired && accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
        cache,
        next,
    });

    if (!response.ok) {
        throw new Error((await response.json()).message || response.statusText);
    }

    return response.json();
}

export const api = {
    get<T>(url: string, options?: RequestOptions): Promise<T> {
        return fetchApi<T>(url, { ...options, method: 'GET' });
    },
    post<T>(url: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return fetchApi<T>(url, { ...options, method: 'POST', body });
    },
    put<T>(url: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return fetchApi<T>(url, { ...options, method: 'PUT', body });
    },
    patch<T>(url: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return fetchApi<T>(url, { ...options, method: 'PATCH', body });
    },
    delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return fetchApi<T>(url, { ...options, method: 'DELETE' });
    },
};