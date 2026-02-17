import { fetchChats } from '@/lib/api/chat';
import { useQuery } from '@tanstack/react-query';

type ChatType = 'group' | 'private';

export function useChats(type?: ChatType) {
  return useQuery({
    queryKey: ['chats', type],
    queryFn: () => fetchChats(type),
  });
}
