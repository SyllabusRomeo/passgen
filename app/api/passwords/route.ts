import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptPassword, decryptPassword } from '@/lib/encryption';
import { checkPasswordBreach, checkServiceBreach } from '@/lib/breach-checker';
import { sendEmail, generateBreachAlertEmail } from '@/lib/email';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();
    
    const passwords = await prisma.passwordEntry.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        breachAlerts: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Decrypt passwords for display (in production, handle this more securely)
    // Also calculate current password age
    const now = new Date();
    const decryptedPasswords = passwords.map((p: typeof passwords[0]) => {
      const lastChange = new Date(p.lastPasswordChange);
      const passwordAge = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...p,
        password: decryptPassword(p.passwordHash),
        passwordAge,
      };
    });

    return NextResponse.json(decryptedPasswords);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching passwords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch passwords' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { serviceName, username, password, url, notes } = body;

    if (!serviceName || !password) {
      return NextResponse.json(
        { error: 'Service name and password are required' },
        { status: 400 }
      );
    }

    // Encrypt password before storing
    const encryptedPassword = encryptPassword(password);

    // Check for breaches
    const passwordBreach = await checkPasswordBreach(password);
    const serviceBreach = await checkServiceBreach(serviceName);

    const isBreached = passwordBreach.found || serviceBreach.found;
    const breachDetails = [
      ...(passwordBreach.found ? passwordBreach.breachDetails || [] : []),
      ...(serviceBreach.found ? serviceBreach.breachDetails || [] : []),
    ];

    // Calculate password expiration (90 days from now)
    const passwordExpiresAt = new Date();
    passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 90);

    const passwordEntry = await prisma.passwordEntry.create({
      data: {
        userId: session.userId,
        serviceName,
        username: username || null,
        passwordHash: encryptedPassword,
        url: url || null,
        notes: notes || null,
        isBreached,
        breachDetails: breachDetails.length > 0 ? JSON.stringify(breachDetails) : null,
        lastChecked: new Date(),
        lastPasswordChange: new Date(),
        passwordAge: 0,
        passwordExpiresAt,
      },
    });

    // If breached, create alert and send email
    if (isBreached) {
      await prisma.breachAlert.create({
        data: {
          passwordEntryId: passwordEntry.id,
          breachSource: breachDetails.join(', '),
          breachDate: new Date(),
        },
      });

      // Send email notification
      const notificationEmail = process.env.NOTIFICATION_EMAIL;
      if (notificationEmail) {
        await sendEmail({
          to: notificationEmail,
          subject: `🚨 Security Alert: Password Breach Detected for ${serviceName}`,
          html: generateBreachAlertEmail(serviceName, breachDetails, passwordEntry.id),
        });

        // Update breach alert as notified
        await prisma.breachAlert.updateMany({
          where: { passwordEntryId: passwordEntry.id },
          data: { notified: true, notifiedAt: new Date() },
        });
      }
    }

    return NextResponse.json({
      ...passwordEntry,
      password: decryptPassword(passwordEntry.passwordHash),
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error creating password:', error);
    return NextResponse.json(
      { error: 'Failed to create password entry' },
      { status: 500 }
    );
  }
}

