
import { useQuestionService } from '../services/api/useQuestionService';
import styles from './QuestionInFullFocus.module.css'
import { useParams } from 'react-router-dom'


const QuestionInFullFocus = () => {
    const { id } = useParams();
    const { inFullFocusQuestionQuery } = useQuestionService();
    const data = inFullFocusQuestionQuery(id);

    if(!data) return(
        <div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <h1>Loading...</h1>
        </div>
    )

  return (
    <div>
         <br/>
         <br/>
         <br/>
         <br/>
         <br/>
         <br/>
         <br/>
            <h1>{data.title}</h1>
            {data.tags.map((tag)=>(<h3>{tag}</h3>))}
            <h2>{data.content}</h2>
            
    </div>
  )

}

export default QuestionInFullFocus