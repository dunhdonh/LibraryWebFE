import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
import { jwtDecode } from 'jwt-decode';
import store from '../redux/store.js';
import { setUser } from '../redux/userSlice.js';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem('token', newAccessToken);
                const decodedUser = jwtDecode(newAccessToken);
                console.log("Decoded user from new access token:", decodedUser);
                localStorage.setItem('user', decodedUser); // Lưu ID của user
                store.dispatch(setUser(decodedUser)); // Cập nhật thông tin user vào Redux

                console.log("New access token:", newAccessToken);

                // Update Authorization header and retry
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                // Handle refresh token failure, logout user
                console.error("Refresh token failed:", err);
                
            }
        }
        return Promise.reject(error);
    }
);

export default api;
//User API
export const login = async (username, password) => {
    try {
        const response = await api.post(`/auth/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error.response ? error.response.data : error;
    }
}

export const registerUser = async (userData) => {
    try {
        const response = await api.post(`/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getUserProfile = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        throw error.response ? error.response.data : error;
    }
}

export const updateUserProfile = async (userId, profileData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.put(`/users/${userId}`, profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update user profile:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await api.get(`/users/get-all`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getUserByUsername = async (username) => {
    try {
        const response = await api.get(`/users/username/${username}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user by username:", error);
        throw error.response ? error.response.data : error;
    }
}

export const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error.response ? error.response.data : error;
    }
}

export const updateUserRole = async (userId, role) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.put(`/users/${userId}/role`, { role }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update user role:", error);
        throw error.response ? error.response.data : error;
    }
}

export const deleteUserByAdmin = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete user by admin:", error);
        throw error.response ? error.response.data : error;
    }
}


// Book API
export const getAllBooks = async ({ category, search }) => {
    try {
        const response = await api.get(`/books/get-all`,
            {
                params: {
                    category: category || '',
                    search: search || ''
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch books:", error);
        throw error.response ? error.response.data : error;
    }
}
export const getBookById = async (bookId) => {
    try {
        const response = await api.get(`/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch book:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getBooksByTitle = async (title) => {
    try {
        const response = await api.get(`/books/title/${title}`);
        console.log("Books fetched by title:", title, response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch books by title:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getBooksByCategory = async (categoryId) => {
    try {
        const response = await api.get(`/books/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch books by category:", error);
        throw error.response ? error.response.data : error;
    }
}

export const addBook = async (bookData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.post(`/books/create`, bookData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add book:", error);
        throw error.response ? error.response.data : error;
    }
}
export const updateBook = async (bookId, bookData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.put(`/books/${bookId}`, bookData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update book:", error);
        throw error.response ? error.response.data : error;
    }
}
export const deleteBook = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/books/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete book:", error);
        throw error.response ? error.response.data : error;
    }
}

export const borrowBook = async (userId, bookId, status,  borrowDate, dueDate,) => {
    const token = localStorage.getItem('token');

    console.log("Borrowing book with userId:", userId, "bookId:", bookId, "borrowDate:", borrowDate, "dueDate:", dueDate, "status:", status);
    try {
        const response = await api.post(`/borrowings/create`, { userId, bookId, status, borrowDate, dueDate }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to borrow book:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getBorrowedBooks = async (userId, status) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`/borrowings/user/${userId}`, {
            params: { status },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch borrowed books:", error);
        throw error.response ? error.response.data : error;
    }
}

export const updateBorrowingStatus = async (borrowingId, status, dueDate, returnDate) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.put(`/borrowings/${borrowingId}`, { status, dueDate, returnDate}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update borrowing status:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getAllBorrowings = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`/borrowings/get-all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all borrowings:", error);
        throw error.response ? error.response.data : error;
    }
}

export const getBorrowingById = async (borrowingId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`/borrowings/${borrowingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch borrowing by ID:", error);
        throw error.response ? error.response.data : error;
    }
}

export const deleteBorrowing = async (borrowingId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/borrowings/${borrowingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete borrowing:", error);
        throw error.response ? error.response.data : error;
    }
}



export const getAllCategories = async () => {
    try {
        const response = await api.get(`/categories/get-all`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw error.response ? error.response.data : error;
    }
}

export const sendOTP = async (email) => {
    try {
        const response = await api.post(`/auth/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Failed to send OTP:", error);
        throw error.response ? error.response.data : error;
    }
}

export const verifyOTP = async (token, otp) => {
    try {
        const response = await api.post(`/auth/verify-otp`, { token, otp });
        return response.data;
    } catch (error) {
        console.error("Failed to verify OTP:", error);
        throw error.response ? error.response.data : error;
    }
}

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post(`/auth/reset-password`, { token, newPassword });
        return response.data;
    } catch (error) {
        console.error("Failed to reset password:", error);
        throw error.response ? error.response.data : error;
    }
}