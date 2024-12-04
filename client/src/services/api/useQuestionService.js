import { useToastMessage } from "../../hooks/useToastMessage";
import { useMutation } from "@tanstack/react-query";
import { createApiClient } from "./apiClient";
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
export const useQuestionService = () => {
    const apiClient = createApiClient();
    const { successMessage, errorMessage } = useToastMessage();
    const navigate = useNavigate();
    const { mutate: question } = useMutation({
        mutationFn: async ({title, content, author_id, tags}) => {
            const response = await apiClient.post('/threads/create', { title, content, author_id, tags });
            return response.data;
        },
        onSuccess: () => {
            successMessage('You succesfully posted a question');
            navigate('/questions', {replace: true});
        },
        onError: (error) => {
            console.error('Create thread error:', error);
            errorMessage(`Error: ${error}`);
        },
    });
    const userQuestionsQuery = (userId) => {

        const { data } = useQuery({
            queryKey: ['userData', userId],
            queryFn: async () => {
                if (!userId) {
                    return null;
                }
                const response = await apiClient.get(`/users/${userId}/threads`);
                return response.data;
            },
            enabled: !!userId, 
            retry: true,
            refetchOnWindowFocus: false,
        });
        
        return data;
    }
    return {question, userQuestionsQuery};
}