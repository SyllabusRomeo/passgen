import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptPassword, decryptPassword } from '@/lib/encryption';
import { checkPasswordBreach, checkServiceBreach } from '@/lib/breach-checker';
import { sendEmail, generateBreachAlertEmail } from '@/lib/email';

export async function GET() {
  try {
    const passwords = await prisma.passwordEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        breachAlerts: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Decrypt passwords for display (in production, handle this more securely)
    const decryptedPasswords = passwords.map(p => ({
      ...p,
      password: decryptPassword(p.passwordHash),
    }));

    return NextResponse.json(decryptedPasswords);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch passwords' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const passwordEntry = await prisma.passwordEntry.create({
      data: {
        serviceName,
        username: username || null,
        passwordHash: encryptedPassword,
        url: url || null,
        notes: notes || null,
        isBreached,
        breachDetails: breachDetails.length > 0 ? JSON.stringify(breachDetails) : null,
        lastChecked: new Date(),
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
  } catch (error) {
    console.error('Error creating password:', error);
    return NextResponse.json(
      { error: 'Failed to create password entry' },
      { status: 500 }
    );
  }
}

