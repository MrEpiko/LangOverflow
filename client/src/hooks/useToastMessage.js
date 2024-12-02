import { toast } from 'react-toastify';
export const useToastMessage = () => {
  const successMessage = title => toast.success(title);
  const errorMessage = title => toast.error(title);
  return { successMessage, errorMessage }
}