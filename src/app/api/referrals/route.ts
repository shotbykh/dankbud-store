import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Generate a unique 6-char referral code
function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// GET: Get member's referral code (or create if doesn't exist)
export async function GET(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(request.url);
        const memberId = searchParams.get('memberId');

        if (!memberId) {
            return NextResponse.json({ error: 'memberId required' }, { status: 400 });
        }

        // Check if code exists
        let { data: existingCode } = await supabase
            .from('referral_codes')
            .select('*')
            .eq('member_id', memberId)
            .single();

        if (existingCode) {
            return NextResponse.json({ code: existingCode });
        }

        // Generate new code
        let code = generateCode();
        let attempts = 0;
        
        while (attempts < 10) {
            const { data, error } = await supabase
                .from('referral_codes')
                .insert({ member_id: memberId, code })
                .select()
                .single();

            if (!error) {
                return NextResponse.json({ code: data });
            }
            
            if (error.code === '23505') {
                code = generateCode();
                attempts++;
            } else {
                throw error;
            }
        }

        throw new Error('Could not generate unique code');

    } catch (error: any) {
        console.error('Referral error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Validate and redeem referral code
export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { code, newMemberId } = await request.json();

        if (!code || !newMemberId) {
            return NextResponse.json({ error: 'code and newMemberId required' }, { status: 400 });
        }

        // Find the referral code
        const { data: referralCode, error: findError } = await supabase
            .from('referral_codes')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (findError || !referralCode) {
            return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
        }

        // Can't use own code
        if (referralCode.member_id === newMemberId) {
            return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 });
        }

        // Create redemption record
        const { error: redeemError } = await supabase
            .from('referral_redemptions')
            .insert({
                referral_code_id: referralCode.id,
                referred_member_id: newMemberId,
                referrer_credit: 50,
                referred_credit: 50
            });

        if (redeemError) throw redeemError;

        // Update referral code stats
        await supabase
            .from('referral_codes')
            .update({ 
                uses: referralCode.uses + 1,
                credits_earned: referralCode.credits_earned + 50
            })
            .eq('id', referralCode.id);

        // Update referred member
        await supabase
            .from('members')
            .update({ referred_by: code.toUpperCase() })
            .eq('id', newMemberId);

        return NextResponse.json({ 
            success: true,
            message: 'Referral redeemed! Both members get R50 credit.',
            referrer_credit: 50,
            referred_credit: 50
        });

    } catch (error: any) {
        console.error('Redeem error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
