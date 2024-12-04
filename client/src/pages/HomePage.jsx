import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const HomePage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate('/ask-question');
  }

  return (
    <>
      <h1>Home Page</h1>
      <h2>{user.username}</h2>
      <h3>{user.email}</h3>
      <button onClick={handleOnClick}>Ask a question</button>
    </>
  );
}
export default HomePage;