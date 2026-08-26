import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import crypto from 'crypto';

function base32ToBuffer(base32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let i = 0; i < base32.length; i++) {
    const val = chars.indexOf(base32[i].toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function verifyTOTP(token, secret, window = 1) {
  if (!token || token.length !== 6) return false;
  
  const key = base32ToBuffer(secret);
  const timeStep = Math.floor(Date.now() / 30000);
  const tokenBuffer = Buffer.from(token, 'utf8');

  for (let i = -window; i <= window; i++) {
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeUInt32BE(0, 0);
    timeBuffer.writeUInt32BE(timeStep + i, 4);

    const hmac = crypto.createHmac('sha1', key);
    hmac.update(timeBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const otp = (binary % 1000000).toString().padStart(6, '0');
    const otpBuffer = Buffer.from(otp, 'utf8');

    if (crypto.timingSafeEqual(tokenBuffer, otpBuffer)) {
      return true;
    }
  }
  return false;
}

export async function POST(request) {
  try {
    // Artificial 1-second delay to defeat brute-force timing attacks
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const secret = process.env.ADMIN_TOTP_SECRET;
    if (!secret) {
      console.error('ADMIN_TOTP_SECRET is not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Validate TOTP using native crypto
    const cleanCode = code.replace(/\s+/g, '');
    const isValid = verifyTOTP(cleanCode, secret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // Create JWT
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 });
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(jwtSecret);

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
