import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import style from './LandingPage.module.css';
const LandingPage = () => {
  const { token } = useAuthContext();
  if (token != null) return <Navigate to="/home" replace />;
  return (
    <div className={style.LandingPage}>
      <h1>Landing Page</h1>
    </div>
  )
}
export default LandingPage;