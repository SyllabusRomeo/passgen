import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptPassword } from '@/lib/encryption';
import { checkPasswordBreach, checkServiceBreach } from '@/lib/breach-checker';
import { sendEmail, generateBreachAlertEmail } from '@/lib/email';
import { requireAuth } from '@/lib/auth';

// This endpoint can be called periodically (e.g., via cron job) to check all passwords
export async function POST() {
  try {
    const session = await requireAuth();
    const passwords = await prisma.passwordEntry.findMany({
      where: {
        userId: session.userId,
        isResolved: false, // Only check unresolved passwords
      },
    });

    const results = {
      checked: 0,
      breached: 0,
      errors: 0,
    };

    for (const entry of passwords) {
      try {
        results.checked++;
        const password = decryptPassword(entry.passwordHash);
        
        // Check for breaches
        const passwordBreach = await checkPasswordBreach(password);
        const serviceBreach = await checkServiceBreach(entry.serviceName);

        const isBreached = passwordBreach.found || serviceBreach.found;
        const breachDetails = [
          ...(passwordBreach.found ? passwordBreach.breachDetails || [] : []),
          ...(serviceBreach.found ? serviceBreach.breachDetails || [] : []),
        ];

        const wasBreached = entry.isBreached;

        // Update password entry
        await prisma.passwordEntry.update({
          where: { id: entry.id },
          data: {
            isBreached,
            breachDetails: breachDetails.length > 0 ? JSON.stringify(breachDetails) : null,
            lastChecked: new Date(),
            isResolved: isBreached ? false : entry.isResolved,
            resolvedAt: isBreached ? null : entry.resolvedAt,
          },
        });

        // If newly breached, create alert and send email
        if (isBreached && !wasBreached) {
          results.breached++;
          
          await prisma.breachAlert.create({
            data: {
              passwordEntryId: entry.id,
              breachSource: breachDetails.join(', '),
              breachDate: new Date(),
            },
          });

          const notificationEmail = process.env.NOTIFICATION_EMAIL;
          if (notificationEmail) {
            await sendEmail({
              to: notificationEmail,
              subject: `🚨 Security Alert: Password Breach Detected for ${entry.serviceName}`,
              html: generateBreachAlertEmail(entry.serviceName, breachDetails, entry.id),
            });

            await prisma.breachAlert.updateMany({
              where: { passwordEntryId: entry.id },
              data: { notified: true, notifiedAt: new Date() },
            });
          }
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error checking password ${entry.id}:`, error);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Monitoring complete. Checked ${results.checked} passwords, found ${results.breached} new breaches.`,
      results,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error in monitoring service:', error);
    return NextResponse.json(
      { error: 'Failed to run monitoring service' },
      { status: 500 }
    );
  }
}

// GET endpoint to check monitoring status
export async function GET() {
  try {
    const session = await requireAuth();
    const stats = await prisma.passwordEntry.aggregate({
      _count: {
        id: true,
      },
      where: {
        userId: session.userId,
        isBreached: true,
        isResolved: false,
      },
    });

    const totalPasswords = await prisma.passwordEntry.count({
      where: { userId: session.userId },
    });
    const breachedPasswords = stats._count.id;

    return NextResponse.json({
      totalPasswords,
      breachedPasswords,
      safePasswords: totalPasswords - breachedPasswords,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching monitoring stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring stats' },
      { status: 500 }
    );
  }
}

