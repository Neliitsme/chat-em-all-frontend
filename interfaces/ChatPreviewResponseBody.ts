export interface ChatPreviewResponseBody {
  id: string;
  name: string;
  users_ids: string[];
  messages: [{ text: string; owner_id: string }];
}
