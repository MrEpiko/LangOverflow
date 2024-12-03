import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import styles from './ProfilePage.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '../services/api/apiClient'; 
import { useQuestionService } from '../services/api/useQuestionService';

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
            <h1>{user.username}</h1>
            <h2>{user.email}</h2>
            <button onClick={logout}>Logout</button>
            {data && data.threads.map((thread) => (
                <h1 key={thread.id}>{thread.title}</h1>
            ))}
        </div>
    );
};

export default ProfilePage;
