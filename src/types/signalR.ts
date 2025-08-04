// SignalR Event Types - Backend dokümantasyonuna göre

export interface TableChangedEvent {
  tableId: number;
  branchId: number;
  changeType: 'Created' | 'Updated' | 'Deleted';
  tableData?: any;
}

export interface TablesBatchCreatedEvent {
  branchId: number;
  createdTables: number[];
  totalCount: number;
}

export interface TableCategoryChangedEvent {
  categoryId: number;
  branchId: number;
  changeType: 'Created' | 'Updated' | 'Deleted';
  categoryData?: any;
}

export interface TableStatusChangedEvent {
  tableId: number;
  branchId: number;
  isOccupied: boolean;
  status: string;
  updatedAt: string;
}

export interface RefreshTableListEvent {
  branchId: number;
  reason: string;
}

export interface SignalRErrorEvent {
  message: string;
  code?: string;
  details?: any;
}

// SignalR Callback Types
export interface SignalRCallbacks {
  onTableChanged?: (data: TableChangedEvent) => void;
  onTablesBatchCreated?: (data: TablesBatchCreatedEvent) => void;
  onTableCategoryChanged?: (data: TableCategoryChangedEvent) => void;
  onTableStatusChanged?: (data: TableStatusChangedEvent) => void;
  onRefreshTableList?: (data: RefreshTableListEvent) => void;
  onError?: (data: SignalRErrorEvent) => void;
}

// SignalR Connection State
export type SignalRConnectionState = 
  | 'Disconnected'
  | 'Connecting'
  | 'Connected'
  | 'Reconnecting';

// SignalR Service Return Type
export interface SignalRServiceReturn {
  isConnected: boolean;
  connectionState: SignalRConnectionState;
  reconnect: () => void;
  requestTableStatus: () => void;
} 