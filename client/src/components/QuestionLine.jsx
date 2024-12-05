import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToastMessage } from '../hooks/useToastMessage';
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './QuestionLine.module.css';
import Tag from './Tag';
import profile_img from '../assets/profile.png'

const QuestionLine = ({thread, id}) => {
const { upvote, downvote} = useQuestionService();
const data = thread;
const { user } = useAuthContext();
const { errorMessage } = useToastMessage();
const [upDownNumber, setUpDownNumber] = useState(0);
const [status, setStatus] = useState("");
useEffect(() => {
  console.log(thread);

  setUpDownNumber(data.upvotes.length - data.downvotes.length);
  if (data.upvotes.includes(user.id)) {
    setStatus("UPVOTED");
  } else if (data.downvotes.includes(user.id)) {
    setStatus("DOWNVOTED");
  } else {
    setStatus("NEUTRAL");
  }
}, [data, user.id]);
const handleUpVote = async () => {
  if (status === "UPVOTED") {
    errorMessage("You already upvoted this thread!");
    return;
  }
  const prevStatus = status;
  if (prevStatus === "NEUTRAL") {
    setStatus("UPVOTED");
    setUpDownNumber((prev) => prev + 1);
  } else if (prevStatus === "DOWNVOTED") {
    setStatus("NEUTRAL");
    setUpDownNumber((prev) => prev + 1);
  }
  try {
    upvote(thread.id);
  } catch (error) {
    setStatus(prevStatus);
    setUpDownNumber((prev) =>
      prevStatus === "NEUTRAL" ? prev - 1 : prev - 1
    );
    errorMessage("Failed to upvote the thread.");
  }
};
const handleDownVote = async () => {
  if (status === "DOWNVOTED") {
    errorMessage("You already downvoted this thread!");
    return;
  }
  const prevStatus = status;
  if (prevStatus === "NEUTRAL") {
    setStatus("DOWNVOTED");
    setUpDownNumber((prev) => prev - 1);
  } else if (prevStatus === "UPVOTED") {
    setStatus("NEUTRAL");
    setUpDownNumber((prev) => prev - 1);
  }
  try {
    downvote(thread.id);
  } catch (error) {
    setStatus(prevStatus);
    setUpDownNumber((prev) =>
      prevStatus === "NEUTRAL" ? prev + 1 : prev + 1
    );
    errorMessage("Failed to downvote the thread.");
  }
  
};


  return (
    <div className={styles.container}>
    <div className={styles.impressions}>
      <button onClick={handleUpVote}>Upvote</button>
        <p>{upDownNumber}</p>
      <button onClick={handleDownVote}>Downvote</button>
    </div>
      <div className={styles.cont}>
      <Link className={styles.link}to={`/questioninfullfocus/${thread.id}`}>
        <div className={styles.contentContainer}>
          <h1>{thread.title}</h1>
          <h3>{
              thread.content.length>20 ? 
              thread.content.substring(0,20) + "..." : thread.content
            }
          </h3>
          <div className={styles.tags}>
            {thread.tags.map((tag)=>(<h3 className={styles.tag}>{tag}</h3>))}
          </div>
      </div>

      <div className={styles.metaData}>
        <div className={styles.authordata}>
          <img className={styles.profilePicture}src={thread.author?.profile_picture && thread.author.profile_picture}></img> 
          <h3 className={styles.authorUsername}> {thread.author?.username}</h3>
        </div>
        <h3>Answers:{thread.replies.length}</h3>
      </div>
        
      </Link>
      </div>
    </div>
  );
}
export default QuestionLine;