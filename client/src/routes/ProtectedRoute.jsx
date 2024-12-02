import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthContext();
  if (token == null) return <Navigate to='/login' replace/>;
  return children;
}
export default ProtectedRoute;