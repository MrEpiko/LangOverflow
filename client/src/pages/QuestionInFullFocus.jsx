
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './QuestionInFullFocus.module.css'
import { useParams } from 'react-router-dom'
import { formatDate } from '../utils/formatDate';

const QuestionInFullFocus = () => {
    const { id } = useParams();
    const { inFullFocusQuestionQuery } = useQuestionService();
    const data = inFullFocusQuestionQuery(id);

    if(!data) return(
        <div>

        <h1>Loading...</h1>
        </div>
    )


    const upDownNumber = (data.upvotes.length-data.downvotes.length);

  return (
    <div>
            <button>Upvote</button><h1>{data.title}</h1> <h4>{formatDate(data.created_at)}</h4>
            <h2>{upDownNumber}</h2>{data.tags.map((tag,index)=>(<h3 key={tag+index} >{tag}</h3>))}
            <button>Downvote</button><h2>{data.content}</h2>
            
    </div>
  )

}

export default QuestionInFullFocus