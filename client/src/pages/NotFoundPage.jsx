import { Link } from "react-router-dom";
import Pagelayout from "../layouts/Pagelayout";
const NotFoundPage = () => {
  return (
    <Pagelayout>
        <h1>Not found</h1>
        <Link to="/" ><h2 style={{color: "orange"}}>Back to Home Page</h2></Link>
    </Pagelayout>
  );
}
export default NotFoundPage;