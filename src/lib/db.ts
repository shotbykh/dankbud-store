import { supabase, supabaseAdmin } from './supabase';
import { hashPassword } from './auth';

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  joinedAt: string;
  totalSpent: number;
  password?: string;
  role?: 'MEMBER' | 'ADMIN' | 'STAFF'; // Defaults to MEMBER
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
    pudoTerminal?: { id: string | number; name: string; };
  };
  createdAt: string;
  paymentMethod: 'EFT' | 'CASH' | 'ONLINE';
  deliveryMethod: 'DELIVERY' | 'COLLECTION' | 'PUDO';
}

// --- SUPABASE API ---

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabaseAdmin.from('members').select('*');
  if (error) {
      console.error("Supabase Error:", error);
      return [];
  }
  return data.map((d: any) => ({
      ...d,
      fullName: d.full_name,
      idNumber: d.id_number,
      joinedAt: d.joined_at,
      totalSpent: d.total_spent,
      role: d.role || 'MEMBER'
  }));
}

export async function saveMember(member: Member) {
  // Check duplicates
  const { data: existing } = await supabase
      .from('members')
      .select('id')
      .or(`email.eq.${member.email},id_number.eq.${member.idNumber}`)
      .single();
      
  if (existing) throw new Error("Member already exists");

  const passwordToSave = member.password ? await hashPassword(member.password) : undefined;

  const { error } = await supabaseAdmin.from('members').insert({
      id: member.id,
      full_name: member.fullName,
      email: member.email,
      phone: member.phone,
      id_number: member.idNumber,
      status: member.status,
      joined_at: member.joinedAt,
      total_spent: member.totalSpent,
      password: passwordToSave
  });

  if (error) throw new Error(error.message);
  return member;
}

export async function saveOrder(order: Order) {
  console.log("Saving Order for Member:", order.memberId);

  const addressPayload = order.deliveryMethod === 'PUDO' 
      ? { ...order.address, pudoTerminal: order.address.pudoTerminal } 
      : order.address;

  const { error } = await supabaseAdmin.from('orders').insert({
      id: order.id,
      member_id: order.memberId,
      items: order.items,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      delivery_method: order.deliveryMethod,
      address: addressPayload,
      created_at: order.createdAt
  });
  
  if (error) {
      console.error("Supabase SaveOrder Error:", error);
      throw new Error(error.message + " (Details: " + JSON.stringify(error) + ")");
  }
  return order;
}

export async function getOrders(): Promise<Order[]> {
    const { data, error } = await supabaseAdmin.from('orders').select('*');
    if (error) return [];
    
    return data.map((d: any) => ({
        id: d.id,
        memberId: d.member_id,
        items: d.items,
        total: d.total,
        status: d.status,
        address: d.address,
        createdAt: d.created_at,
        paymentMethod: d.payment_method,
        deliveryMethod: d.delivery_method
    }));
}

export async function updateMemberStatus(id: string, status: Member['status']) {
    const { error } = await supabaseAdmin
        .from('members')
        .update({ status })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    return { id, status };
}

export async function updateOrderStatus(id: string, status: Order['status'], paymentStatus?: string) {
    const { error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    return { id, status };
}

export async function logAdminAction(adminId: string, action: string, details?: any) {
    const { error } = await supabaseAdmin
        .from('audit_logs')
        .insert({
            admin_id: adminId,
            action,
            details
        });

    if (error) console.error("Audit Log Error:", error);
}

export async function getAuditLogs() {
    const { data, error } = await supabase
        .from('audit_logs')
        .select(`
            *,
            members (
                full_name,
                email
            )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Fetch Audit Logs Error:", error);
        return [];
    }

    return data.map((log: any) => ({
        id: log.id,
        adminName: log.members?.full_name || 'System',
        adminEmail: log.members?.email || 'System',
        action: log.action,
        details: log.details,
        createdAt: log.created_at
    }));
}

export async function getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabaseAdmin.from('orders').select('*').eq('id', id).single();
    if (error || !data) return null;
    
    return {
        id: data.id,
        memberId: data.member_id,
        items: data.items,
        total: data.total,
        status: data.status,
        address: data.address,
        createdAt: data.created_at,
        paymentMethod: data.payment_method,
        deliveryMethod: data.delivery_method
    };
}
