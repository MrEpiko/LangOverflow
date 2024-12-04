import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './ProfilePage.module.css';
import profile_img from '../assets/profile.png';
const ProfilePage = () => {
    const { user } = useAuthContext();
    const { logout } = useAuthService();
    const [userId, setUserId] = useState(null);
    const {userQuestionsQuery} = useQuestionService();
    useEffect(() => {
        if (user?.id) {
            setUserId(user.id);
        }
    }, [user]);
    const data = userQuestionsQuery(userId);
    return (
        <div className={styles.profileCard}>
            <h3>id: {user.id}</h3>
            <h3>{user.username}</h3>
            <h3>{user.email}</h3>
            <img className={styles.profile_picture} src={user.profile_picture ? user.profile_picture : profile_img} alt="Profile" />
            <button onClick={logout}>Logout</button>
            {data && data.threads.map((thread) => (
                <h1 key={thread.id}>{thread.title}</h1>
            ))}
        </div>
    );
};
export default ProfilePage;