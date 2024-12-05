import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './ProfilePage.module.css';
import profile_img from '../assets/profile.png';
import QuestionLine from '../components/QuestionLine';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading'
const ProfilePage = () => {
    const { user } = useAuthContext();
    const { logout, deleteProfile } = useAuthService();
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
                            <h3>{user.email}</h3>
                        </div>
                    </div>
                    <div className={styles.redOnes}>
                        <button onClick={logout}>Logout</button>
                        <button onClick={()=>deleteProfile(userId)}>Delete profile</button>
                    </div>
                </div>
                {
                    data && (data.threads.length === 0 ? <h2 className={styles.dontHave}>You don't have any posted questions.</h2> :
                        <div>
                            <h5 className={styles.yourQuestions}>Your questions:</h5>
                            <div className={styles.questionLines}>
                        
                        {
                            data && data.threads.map((thread) => (
                                <div key={thread.id}>
                                    <QuestionLine thread={thread}/>
                                </div>
                            ))
                        }
                    </div> 
                    </div>
                        
                )}
            </div> 
        </div>
        </>
    );
};
export default ProfilePage;