import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptPassword } from '@/lib/encryption';
import { checkPasswordBreach, checkServiceBreach } from '@/lib/breach-checker';
import { sendEmail, generateBreachAlertEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const passwordEntry = await prisma.passwordEntry.findUnique({
      where: { id: params.id },
    });

    if (!passwordEntry) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
      );
    }

    const password = decryptPassword(passwordEntry.passwordHash);
    
    // Check for breaches
    const passwordBreach = await checkPasswordBreach(password);
    const serviceBreach = await checkServiceBreach(passwordEntry.serviceName);

    const isBreached = passwordBreach.found || serviceBreach.found;
    const breachDetails = [
      ...(passwordBreach.found ? passwordBreach.breachDetails || [] : []),
      ...(serviceBreach.found ? serviceBreach.breachDetails || [] : []),
    ];

    const wasBreached = passwordEntry.isBreached;

    // Update password entry
    const updated = await prisma.passwordEntry.update({
      where: { id: params.id },
      data: {
        isBreached,
        breachDetails: breachDetails.length > 0 ? JSON.stringify(breachDetails) : null,
        lastChecked: new Date(),
        isResolved: isBreached ? false : passwordEntry.isResolved,
        resolvedAt: isBreached ? null : passwordEntry.resolvedAt,
      },
    });

    // If newly breached, create alert and send email
    if (isBreached && !wasBreached) {
      await prisma.breachAlert.create({
        data: {
          passwordEntryId: params.id,
          breachSource: breachDetails.join(', '),
          breachDate: new Date(),
        },
      });

      const notificationEmail = process.env.NOTIFICATION_EMAIL;
      if (notificationEmail) {
        await sendEmail({
          to: notificationEmail,
          subject: `🚨 Security Alert: Password Breach Detected for ${passwordEntry.serviceName}`,
          html: generateBreachAlertEmail(passwordEntry.serviceName, breachDetails, params.id),
        });

        await prisma.breachAlert.updateMany({
          where: { passwordEntryId: params.id },
          data: { notified: true, notifiedAt: new Date() },
        });
      }
    }

    return NextResponse.json({
      ...updated,
      password: decryptPassword(updated.passwordHash),
      breachDetails: breachDetails,
    });
  } catch (error) {
    console.error('Error checking password:', error);
    return NextResponse.json(
      { error: 'Failed to check password' },
      { status: 500 }
    );
  }
}

