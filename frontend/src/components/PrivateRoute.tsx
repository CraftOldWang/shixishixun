import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 开发时不进行权限验证， 可以随便跳转网页
// 如果用JWT， 应该需要进行改动。
const IS_DEV_MODE = false;

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();//TODO Auth要改成JWT， 这里也要。

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