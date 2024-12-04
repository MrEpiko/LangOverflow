import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import styles from './LandingPage.module.css';
const LandingPage = () => {
  const { token } = useAuthContext();
  if (token != null) return <Navigate to="/home" replace />;
  return (
    <div className={styles.LandingPage}>
      <h1>Landing Page</h1>
    </div>
  )
}
export default LandingPage;