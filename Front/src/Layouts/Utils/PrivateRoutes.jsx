import { Outlet, Navigate } from 'react-router-dom'

function PrivateRoutes() {
    const useAuth = () => {
        const user = localStorage.getItem('authToken')
        if (user) {
            return true;
        } else {
            return false
        }
    };
    const token = useAuth()
    return token ? <Outlet /> : <Navigate to='/Login' />
}

export default PrivateRoutes