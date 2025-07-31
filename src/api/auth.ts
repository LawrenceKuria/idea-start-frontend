import api from "@/lib/axios";

export const registerUser = async ({
    name,
    email,
    password
}: {
    name: string
    email: string
    password: string
    }) => {
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            })
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to register'
            throw new Error(message)
        }
}

export const loginUser = async (credentials: {
    email: string
    password: string
}) => {
    try {
        const response = await api.post('/auth/login', credentials)
        return response.data
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to login'
        throw new Error(message)
    }
}

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout')
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to login'
        throw new Error(message)
    }
}

export const refreshToken = async () => {
    try {
        const response = await api.post('/auth/refresh')
        return response.data
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to refresh access token'
        throw new Error(message)
    }
}