import styles from "./Replies.module.css"
import { useEffect, useState } from 'react';
import { useToastMessage } from '../hooks/useToastMessage';
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuestionService } from '../services/api/useQuestionService';
import { formatDate } from "../utils/utils";


const Replies = ({reply}) => {
    const { upvoteReply, downvoteReply, deleteReply} = useQuestionService();
const data = reply;
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
    errorMessage("You already upvoted this reply!");
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
    const obj = {
        "id": reply.id,
        "thread_id": reply.parent_id
    }
    upvoteReply(obj);
  } catch (error) {
    setStatus(prevStatus);
    setUpDownNumber((prev) =>
      prevStatus === "NEUTRAL" ? prev - 1 : prev - 1
    );
    errorMessage("Failed to upvote the reply.");
  }
};
const handleDownVote = async () => {
  if (status === "DOWNVOTED") {
    errorMessage("You already downvoted this reply!");
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
    const obj = {
        "id": reply.id,
        "thread_id": reply.parent_id
    }
    downvoteReply(obj);
  } catch (error) {
    setStatus(prevStatus);
    setUpDownNumber((prev) =>
      prevStatus === "NEUTRAL" ? prev + 1 : prev + 1
    );
    errorMessage("Failed to downvote the reply.");
  }
}

const handleDeleteReply = () => {
    const obj = {
        "id": reply.id,
        "thread_id": reply.parent_id
    }
deleteReply(obj);
}

  return (
    <div>
        <button onClick={handleUpVote}>upvote</button>
        <h2>{upDownNumber}</h2>
        <button onClick={handleDownVote}>downvote</button>
        {/* <h2>{reply.author}</h2> */}
        <h2>{reply.content}</h2>
        <h2>{formatDate(reply.created_at)}</h2>
        {user.id == reply.author_id && <button onClick={handleDeleteReply}> Delete reply</button>}
    </div>
  )
}


export default Replies;