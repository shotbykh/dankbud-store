import { Order } from './db';
import { supabase } from './supabase';

const PUDO_ENV = process.env.PUDO_ENV || 'sandbox';
// Use hyphen for production as verified by debug script
const BASE_URL = PUDO_ENV === 'production' 
  ? 'https://api-pudo.co.za/api/v1' 
  : 'https://sandbox.api-pudo.co.za/api/v1';

const API_KEY = process.env.PUDO_API_KEY;

export interface PudoTerminal {
  id?: number;
  code?: string;
  name: string;
  address: string;
  city?: string;
  detailed_address?: {
      city?: string;
      locality?: string;
      sublocality?: string;
      postal_code?: string;
  };
  latitude: string;
  longitude: string;
  status: string;
  type?: {
      id: number;
      name: string;
  };
}

export const PudoService = {

  async getLockers(): Promise<PudoTerminal[]> {
    if (!API_KEY) throw new Error("PUDO_API_KEY is missing");

    const res = await fetch(`${BASE_URL}/lockers-data`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } 
    });

    if (!res.ok) {
        throw new Error(`PUDO API Error: ${res.status} ${await res.text()}`);
    }

    return res.json();
  },

  async findTerminalByName(search: string): Promise<PudoTerminal | undefined> {
    try {
        const lockers = await this.getLockers();
        return lockers.find(l => l.name.toLowerCase().includes(search.toLowerCase()));
    } catch (e) {
        console.warn("Could not find terminal:", e);
        return undefined;
    }
  },

  async createBooking(order: Order, sourceTerminalId: number | string) {
    if (!API_KEY) throw new Error("PUDO_API_KEY is missing");

    // Fetch Member for Contact Details
    const { data: member } = await supabase
        .from('members')
        .select('full_name, email, phone')
        .eq('id', order.memberId)
        .single();
    
    if (!member) throw new Error("Member not found for booking");

    // Defaults if missing
    const receiverPhone = member.phone || "0720000000";
    const receiverName = member.full_name || "DankBud Member";

    // Determine Service Type: L2L (Locker) or L2D (Door)
    const isLocker = order.deliveryMethod === 'PUDO';
    // const isDoor = order.deliveryMethod === 'DELIVERY';

    // Service Code: L2LXS - ECO (Locker) vs L2DXS - ECO (Door)
    // Production API might use different codes, assume L2...XS - ECO for now.
    const serviceCode = isLocker ? "L2LXS - ECO" : "L2DXS - ECO";

    // Construct Address Payload
    let deliveryAddressPayload = {};

    if (isLocker) {
         // L2L: Needs terminal_id
         // @ts-ignore
         const destId = order.address.pudoTerminal?.id || order.address.pudoTerminal?.code;
         if (!destId) throw new Error("No PUDO Terminal ID found for Locker Delivery");
         
         deliveryAddressPayload = {
             terminal_id: destId
         };
    } else {
        // L2D: Needs address details
        // API requires: line1, line2 (opt), suburb (opt), city, postal_code, province (opt)
        deliveryAddressPayload = {
            line1: order.address.street,
            line2: order.address.suburb, // Using line2 for suburb often works better than mapping strictly
            city: order.address.city,
            postal_code: order.address.code
        };
    }

    const payload = {
        collection_address: {
            terminal_id: sourceTerminalId
        },
        delivery_address: deliveryAddressPayload,
        collection_contact: {
            name: "DankBud Dispatch",
            email: "admin@dankbud.co.za",
            mobile_number: "0720000000"
        },
        delivery_contact: {
            name: receiverName,
            email: member.email,
            mobile_number: receiverPhone
        },
        service_level_code: serviceCode, 
        special_instructions_collection: "None",
        special_instructions_delivery: order.address.instructions || "None"
    };

    console.log(`📦 [PUDO] Creating Shipment (${isLocker ? 'L2L' : 'L2D'}):`, JSON.stringify(payload, null, 2));

    const res = await fetch(`${BASE_URL}/shipments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("PUDO Error Body:", err);
        throw new Error(`Booking Failed: ${res.status} ${err}`);
    }

    return res.json();
  }
};
