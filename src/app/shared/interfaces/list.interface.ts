export interface ITask{
    id: string;
    name: string;
    listId: string;
    isDone: boolean;
}

export interface IList {
    id: string;
    name: string;
    listGroupId: string;
    isOpen?: boolean;
  }
  