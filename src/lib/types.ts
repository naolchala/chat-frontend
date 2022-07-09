export interface IMessage {
  id: string;
  from_id: string;
  to_id: string;
  content: {
    text?: string;
  };
  createdAt: string;
  seen: boolean;
  edited: boolean;
}
