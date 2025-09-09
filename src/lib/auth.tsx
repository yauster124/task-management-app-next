import {
    useMutation
} from "@tanstack/react-query"
import { z } from "zod";

import { AuthResponse } from "@/types/api";

import { api } from './api-client';

export const useLogin = ({ onSuccess }: { onSuccess?: (token: string) => void }) => {
    return useMutation({
        mutationFn: loginWithEmailAndPassword,
        onSuccess: (data) => {
            onSuccess?.(data.accessToken);
        },
    })
}

export const loginInputSchema = z.object({
    username: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
    return api.post('/api/auth/signin', data, { authRequired: false });
};
