import { useLocation } from 'react-router-dom';
import Silk from '../Silk';

const GlobalBackground = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    if (isAuthPage) return null;

    return (
        <div className="fixed inset-0 w-full h-full -z-10 bg-black">
            <Silk color="#7B7481" speed={3} scale={2} />
        </div>
    );
};

export default GlobalBackground;
