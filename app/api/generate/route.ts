import { NextRequest, NextResponse } from 'next/server';
import { generatePassword, calculatePasswordStrength } from '@/lib/password-generator';
import type { PasswordOptions } from '@/lib/password-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const options: PasswordOptions = {
      length: body.length || 16,
      includeUppercase: body.includeUppercase !== false,
      includeLowercase: body.includeLowercase !== false,
      includeNumbers: body.includeNumbers !== false,
      includeSymbols: body.includeSymbols !== false,
      excludeSimilar: body.excludeSimilar || false,
    };

    // Validate length
    if (options.length < 4 || options.length > 128) {
      return NextResponse.json(
        { error: 'Password length must be between 4 and 128' },
        { status: 400 }
      );
    }

    const password = generatePassword(options);
    const strength = calculatePasswordStrength(password);

    return NextResponse.json({
      password,
      strength: strength.score,
      feedback: strength.feedback,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate password' },
      { status: 400 }
    );
  }
}

