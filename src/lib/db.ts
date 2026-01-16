import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  joinedAt: string;
  totalSpent: number;
  password?: string; // Optional for now
}

export interface Order {
  id: string;
  memberId: string;
  items: any[];
  total: number;
  status: 'PENDING' | 'PAID' | 'DISPATCHED' | 'DELIVERED';
  address: {
    street: string;
    suburb: string;
    city: string;
    code: string;
    instructions?: string;
  };
  createdAt: string;
  paymentMethod: 'EFT' | 'CASH';
  deliveryMethod: 'DELIVERY' | 'COLLECTION';
}

interface Database {
  members: Member[];
  orders: Order[];
}

// Ensure DB directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH);
}

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ members: [], orders: [] }, null, 2));
}

// Helper to read full DB safely
function readDb(): Database {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const db = JSON.parse(data);
        if (!db.orders) db.orders = []; // Migration for existing file
        return db;
    } catch (e) {
        return { members: [], orders: [] };
    }
}

export function getMembers(): Member[] {
  return readDb().members;
}

export function saveMember(member: Member) {
  const db = readDb();
  // Check duplicates via ID Number or Email
  const existing = db.members.find(m => m.idNumber === member.idNumber || m.email === member.email);
  if (existing) {
    throw new Error("Member already exists");
  }
  
  db.members.push(member);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  return member;
}

export function saveOrder(order: Order) {
    const db = readDb();
    db.orders.push(order);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return order;
}

export function getOrders(): Order[] {
    return readDb().orders;
}

export function updateMemberStatus(id: string, status: Member['status']) {
    const db = readDb();
    const index = db.members.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Member not found");
    
    db.members[index].status = status;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db.members[index];
}
