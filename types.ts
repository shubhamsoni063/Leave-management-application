
export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  HR = 'HR'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum LeaveType {
  CASUAL = 'Casual',
  SICK = 'Sick',
  EARNED = 'Earned',
  SPECIAL = 'Special',
  EMERGENCY = 'Emergency'
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  duration: number;
  createdAt: string;
}

export interface User {
  id: string;
  employeeCode: string;
  dob: string;
  name: string;
  email: string;
  role: Role;
  balances: LeaveBalance[];
}
