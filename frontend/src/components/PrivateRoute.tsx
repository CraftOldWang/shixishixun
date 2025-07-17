import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 不进行权限验证， 可以随便跳转网页
const IS_DEV_MODE = true;

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (IS_DEV_MODE) {
    return <>{children}</>;
  }else {
    return user ? <>{children}</> : <Navigate to="/login" />;
  }
}

export default PrivateRoute;