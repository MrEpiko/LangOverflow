import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './ProfilePage.module.css';
import profile_img from '../assets/profile.png';
import { Link } from 'react-router-dom';
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
            {data && data.threads.map((thread) => (<Link to={`/questioninfullfocus/${thread.id}`}>
            <h1 key={thread.id} >{thread.title}</h1>
            <h3 key={thread.id}>{thread.content.length>20?thread.content.substring(0,20)+"...":thread.content}</h3>
            </Link>))}
        </div>
    );
};
export default ProfilePage;