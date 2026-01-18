import { supabase } from './supabase';

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
  };
  createdAt: string;
  paymentMethod: 'EFT' | 'CASH';
  deliveryMethod: 'DELIVERY' | 'COLLECTION';
}

// --- SUPABASE API ---

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase.from('members').select('*');
  if (error) {
      console.error("Supabase Error:", error);
      return [];
  }
  // Map snake_case database to camelCase app
  return data.map((d: any) => ({
      ...d,
      fullName: d.full_name,
      idNumber: d.id_number,
      joinedAt: d.joined_at,
      totalSpent: d.total_spent,
      role: d.role || 'MEMBER' // Default fallback
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

  const { error } = await supabase.from('members').insert({
      id: member.id,
      full_name: member.fullName,
      email: member.email,
      phone: member.phone,
      id_number: member.idNumber,
      status: member.status,
      joined_at: member.joinedAt,
      total_spent: member.totalSpent,
      password: member.password
      // role defaults to MEMBER in DB, so we don't set it here for fresh signups
  });

  if (error) throw new Error(error.message);
  return member;
}

export async function saveOrder(order: Order) {
  console.log("Saving Order for Member:", order.memberId);

  const { error } = await supabase.from('orders').insert({
      id: order.id,
      member_id: order.memberId,
      items: order.items,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      delivery_method: order.deliveryMethod,
      address: order.address, // stored as jsonb
      created_at: order.createdAt
  });
  
  if (error) {
      console.error("Supabase SaveOrder Error:", error);
      throw new Error(error.message + " (Details: " + JSON.stringify(error) + ")");
  }
  return order;
}

export async function getOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*');
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
    const { error } = await supabase
        .from('members')
        .update({ status })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    return { id, status };
}

export async function updateOrderStatus(id: string, status: Order['status'], paymentStatus?: string) {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    return { id, status };
}

export async function logAdminAction(adminId: string, action: string, details?: any) {
    const { error } = await supabase
        .from('audit_logs')
        .insert({
            admin_id: adminId, // This is TEXT now to match members.id
            action,
            details
        });

    if (error) console.error("Audit Log Error:", error);
}

export async function getAuditLogs() {
    // Select Audit Logs and JOIN with Members to get the Admin's name
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
        .limit(50); // Show last 50 actions

    if (error) {
        console.error("Fetch Audit Logs Error:", error);
        return [];
    }

    // Flatten logic slightly for easier UI consumption
    return data.map((log: any) => ({
        id: log.id,
        adminName: log.members?.full_name || 'System',
        adminEmail: log.members?.email || 'System',
        action: log.action,
        details: log.details,
        createdAt: log.created_at
    }));
}
