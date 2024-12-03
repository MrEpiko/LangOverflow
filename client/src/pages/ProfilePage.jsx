import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import styles from './ProfilePage.module.css';
const ProfilePage = () => {
    const { user } = useAuthContext();
    const { logout } = useAuthService();
    return (
        <div className={styles.profileCard}>
            <h3>id: {user.id}</h3>
            <h1>{user.username}</h1>
            <h2>{user.email}</h2>
            <img className={styles.profile_picture} src={user?.profile_picture} alt="Profile" />
            <button onClick={logout}>Logout</button>
        </div>
    );
};
export default ProfilePage;