import { useQuery } from "@tanstack/react-query"
import { createApiClient } from "./apiClient";

export const getUserQuestions = () => {
    const apiClient = createApiClient();

    const userQuestionsQuery = useQuery({
        queryKey: ["userQuestions"],
        queryFn: async (user_id) => {
            const response = await apiClient.get(`/auth/${user_id}/threads`);
            return response.data;
        }
    });
    return {userQuestionsQuery};
}