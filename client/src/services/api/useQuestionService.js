import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useMutation } from "@tanstack/react-query";
import { createApiClient } from "./apiClient";

export const useQuestionService = () => {
    const apiClient = createApiClient();

    const navigate = useNavigate();
    const { successMessage, errorMessage } = useToastMessage();
    const { mutate: question } = useMutation({
        mutationFn: async ({title, content, author_id, tags}) => {
            const response = await apiClient.post('/threads/create', { title, content, author_id, tags });
            return response.data;
        },
        onSuccess: () => {
            successMessage('You succesfully posted a question');
        },
        onError: (error) => {
            console.error('Create thread error:', error);
            errorMessage(`Error: ${error}`);
        },
    });

    return {question};
}