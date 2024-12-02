import { useAuthContext } from '../hooks/useAuthContext';
const HomePage = () => {
  const { user } = useAuthContext();
  return (
    <>
      <h1>Home Page</h1>
      <h2>{user.username}</h2>
      <h3>{user.email}</h3>
    </>
  );
}
export default HomePage;