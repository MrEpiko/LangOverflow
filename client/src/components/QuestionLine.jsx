import styles from './QuestionLine.module.css'
import { useQuestionService } from '../services/api/useQuestionService';
import profile_img from '../assets/profile.png';
import { useToastMessage } from '../hooks/useToastMessage';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import Tag from './Tag';

const QuestionLine = ({thread}) => {
const { upvote, downvote} = useQuestionService();
const data = thread;
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
    await upvote(thread.id);
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
    await downvote(thread.id);
  } catch (error) {
    setStatus(prevStatus);
    setUpDownNumber((prev) =>
      prevStatus === "NEUTRAL" ? prev + 1 : prev + 1
    );
    errorMessage("Failed to downvote the thread.");
  }
};

  return (
    <div>
         <button onClick={handleUpVote}>Upvote</button>
         <p>{upDownNumber}</p>
         <button onClick={handleDownVote}>Downvote</button>
         <h1>Title:{thread.title}</h1>
         <h3>Content:{thread.content.length>20?thread.content.substring(0,20)+"...":thread.content}</h3>
         {thread.tags.map((tag)=>(<h3>{tag}</h3>))}
         <h3>Username:{thread.author.username}</h3>
         {<h3>Answers:{thread.replies.length}</h3>}
    </div>
  )
}

export default QuestionLine