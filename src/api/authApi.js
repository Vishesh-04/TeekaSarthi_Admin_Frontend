import axiosClient from './axiosClient';

const authApi = {
    login: async (credentials) => {
        // credentials should match SupervisorDTO: { employeeId, name, phone }
        const response = await axiosClient.post('http://localhost:8080/api/supervisor/auth/login', credentials);
        return response.data;
    }
};

export default authApi;
