import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './ProfilePage.module.css';
import profile_img from '../assets/profile.png';
import QuestionLine from '../components/QuestionLine';
import NavBar from '../components/NavBar';
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
        <>
        <NavBar />
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <div className={styles.seperator}>
                    <div className={styles.userInfo}>
                        <img className={styles.profile_picture} src={user.profile_picture ? user.profile_picture : profile_img} alt="Profile" />
                        <div className={styles.userMeta}>
                            <h1>{user.username}</h1>
                            <h3>id: {user.id}</h3>
                        </div>
                        
                    </div>
                    <button onClick={logout}>Logout</button>
                </div>
                <h5>Your questions</h5>
                <div className={styles.questionLines}>
                    {data && data.threads.map((thread) => (
                        <div key={thread.id}>
                            <QuestionLine thread={thread}/>
                        </div>
                    ))}
                </div>
                
                
            </div>
            
        </div>
        </>
        
    );
};
export default ProfilePage;