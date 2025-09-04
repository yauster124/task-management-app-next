import { env } from "@/config/env";

type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    cookie?: string;
    params?: Record<string, string | number | boolean | undefined | null>;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
};

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
    } = options;

    let cookieHeader = cookie;
    if (typeof window === 'undefined' && !cookie) {
        cookieHeader = await getServerCookies();
    }

    let token: string | undefined;

    if (typeof window === "undefined") {
        // server-side
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("token")?.value;
    } else {
        // client-side
        const { getCookie } = await import("cookies-next");
        token = getCookie("token") as string | undefined;
    }

    const fullUrl = buildUrlWithParams(`${env.API_URL}${url}`, params);

    const response = await fetch(fullUrl, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...headers,
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        cache,
        next,
    });

    console.log(body)

    if (!response.ok) {
        const message = (await response.json()).message || response.statusText;
        // if (typeof window !== 'undefined') {
        //     useNotifications.getState().addNotification({
        //         type: 'error',
        //         title: 'Error',
        //         message,
        //     });
        // }
        throw new Error(message);
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