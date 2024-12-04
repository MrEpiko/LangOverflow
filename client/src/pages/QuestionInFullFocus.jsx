
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './QuestionInFullFocus.module.css'
import { useParams } from 'react-router-dom'
import { formatDate } from '../utils/formatDate';
import profile_img from '../assets/profile.png';

const QuestionInFullFocus = () => {
    const { id } = useParams();
    const { inFullFocusQuestionQuery } = useQuestionService();
    const data = inFullFocusQuestionQuery(id);


    const handleUpVote = () => {
      

     }

    if(!data) return(
        <div>

        <h1>Loading...</h1>
        </div>
    )


    const upDownNumber = (data.upvotes.length-data.downvotes.length);

  return (
    <div>
            <h2>{data.author.username}</h2><img className={styles.profile_picture} src={data.author.profile_picture ? data.author.profile_picture : profile_img} alt="Profile" />
            <button onClick={handleUpVote}>Upvote</button><h1>{data.title}</h1> <h4>{formatDate(data.created_at)}</h4>
            <h2>{upDownNumber}</h2>{data.tags.map((tag,index)=>(<h3 key={tag+index} >{tag}</h3>))}
            <button>Downvote</button><h2>{data.content}</h2>
            
    </div>
  )

}

export default QuestionInFullFocus