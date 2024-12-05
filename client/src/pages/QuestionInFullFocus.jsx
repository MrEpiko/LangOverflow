import { useQuestionService } from '../services/api/useQuestionService';
import { useParams } from 'react-router-dom'
import { formatDate } from '../utils/utils';
import { useToastMessage } from '../hooks/useToastMessage';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import profile_img from '../assets/profile.png';
import styles from './QuestionInFullFocus.module.css'
import Replies from '../components/Replies';
const QuestionInFullFocus = () => {
  const { id: threadId } = useParams();
  const { upvote, downvote, inFullFocusQuestionQuery, createReply} = useQuestionService();
  const data = inFullFocusQuestionQuery(threadId);
  const { user } = useAuthContext();
  const { errorMessage } = useToastMessage();
  const [upDownNumber, setUpDownNumber] = useState(0);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    reply: ''
  });
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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmitReply = () => {
    if(formData.reply.length < 10){errorMessage("You need at least 10 letters in a reply!"); return;}
    
    createReply({"parent_id":threadId, "content":formData.reply});
    setFormData({...formData, ["reply"] : ""});
  }


  if(!data) return <h1>Loading...</h1>
  if(data.author == null){
    return (
      <div className={styles.container}>
        <div className={styles.authorThreadContainer}>
          
  
  
          <div className={styles.infoContainer}>
           <div className={styles.impressions}>
            <button onClick={handleUpVote}>Upvote</button>
            <h2>{upDownNumber}</h2>
            <button onClick={handleDownVote}>Downvote</button>
          </div>
          <div className={styles.border}>
          <div className={styles.userdata}>
             <h2>{"Deleted user"}</h2>
            </div>
  
            <div className={styles.threadMainQuestion}>
              <h1>{data.title}</h1> 
              <h2>{data.content}</h2>
            </div>
  
          <div className={styles.tagsAndDate}>
              <div className={styles.tags}>
                {data.tags.map((tag,index)=>(<h3 key={tag+index} className={styles.tag}>{tag}</h3>) )}
              </div>
              <h4>{formatDate(data.created_at)}</h4>
          </div>      
          </div>
            
          </div>
          
          <div className={styles.addReplyContainer}>
            <h2>Reply to the question</h2>
            <textarea placeholder="Reply"onChange={handleChange} name='reply' value={formData.reply}></textarea>
            <button onClick={handleSubmitReply} className={styles.submitReply}>Submit</button>
            
          </div>
          {data.replies.map((x) => <Replies reply={x}/>)}
        </div>
        
      </div>
    );

  }
  else{
  return (
    <div className={styles.container}>
      <div className={styles.authorThreadContainer}>
        


        <div className={styles.infoContainer}>
         <div className={styles.impressions}>
          <button onClick={handleUpVote}>Upvote</button>
          <h2>{upDownNumber}</h2>
          <button onClick={handleDownVote}>Downvote</button>
        </div>
        <div className={styles.border}>
        <div className={styles.userdata}>
           <img className={styles.profile_picture} src={data.author.profile_picture ? data.author.profile_picture : profile_img} alt="Profile" /> <img className={styles.profile_picture} src={data.author.profile_picture ? data.author.profile_picture : profile_img} alt="Profile" />
            <h2>{data.author.username}</h2>
          </div>

          <div className={styles.threadMainQuestion}>
            <h1>{data.title}</h1> 
            <h2>{data.content}</h2>
          </div>

        <div className={styles.tagsAndDate}>
            <div className={styles.tags}>
              {data.tags.map((tag,index)=>(<h3 key={tag+index} className={styles.tag}>{tag}</h3>) )}
            </div>
            <h4>{formatDate(data.created_at)}</h4>
        </div>      
        </div>
          
        </div>
        
        <div className={styles.addReplyContainer}>
          <h2>Reply to the question</h2>
          <textarea placeholder="Reply"onChange={handleChange} name='reply' value={formData.reply}></textarea>
          <button onClick={handleSubmitReply} className={styles.submitReply}>Submit</button>
          
        </div>
        {data.replies.map((x) => <Replies reply={x}/>)}
      </div>
      
    </div>
  );
}
}
export default QuestionInFullFocus;