export type ModalType = 'add-category' | 'edit-category' | 'add-extra' | 'edit-extra' | null;

export type DeleteConfig = {
  isOpen: boolean;
  type: 'category' | 'extra' | null;
  id: number | null;
  name: string;
};
