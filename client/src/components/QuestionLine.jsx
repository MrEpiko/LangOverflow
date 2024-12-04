import styles from './QuestionLine.module.css'

const QuestionLine = ({thread}) => {
  return (
    <div>
         <h1 key={thread.id+"h111"} >{thread.title}</h1>
         <h3 key={thread.id+"h333"}>{thread.content.length>20?thread.content.substring(0,20)+"...":thread.content}</h3>
    </div>
  )
}

export default QuestionLine