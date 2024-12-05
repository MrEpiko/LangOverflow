import { useQuestionService } from '../services/api/useQuestionService';
import { useParams } from 'react-router-dom'
import { formatDate } from '../utils/utils';
import { useToastMessage } from '../hooks/useToastMessage';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import profile_img from '../assets/profile.png';
import styles from './QuestionInFullFocus.module.css'
const QuestionInFullFocus = () => {
  const { id: threadId } = useParams();
  const { upvote, downvote, inFullFocusQuestionQuery } = useQuestionService();
  const data = inFullFocusQuestionQuery(threadId);
  const { user } = useAuthContext();
  const { errorMessage } = useToastMessage();
  const [upDownNumber, setUpDownNumber] = useState(0);
  const [status, setStatus] = useState("");
  useEffect(() => {
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
      upvote(threadId);
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
      downvote(threadId);
    } catch (error) {
      setStatus(prevStatus);
      setUpDownNumber((prev) =>
        prevStatus === "NEUTRAL" ? prev + 1 : prev + 1
      );
      errorMessage("Failed to downvote the thread.");
    }
  };
  if(!data) return <h1>Loading...</h1>
  return (
    <div>
      <h2>{data.author.username}</h2><img className={styles.profile_picture} src={data.author.profile_picture ? data.author.profile_picture : profile_img} alt="Profile" />
      <button onClick={handleUpVote}>Upvote</button><h1>{data.title}</h1> <h4>{formatDate(data.created_at)}</h4>
      <h2>{upDownNumber}</h2>{data.tags.map((tag,index)=>(<h3 key={tag+index} >{tag}</h3>))}
      <button onClick={handleDownVote}>Downvote</button><h2>{data.content}</h2>  
    </div>
  );
}
export default QuestionInFullFocus;