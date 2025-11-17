import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptPassword, decryptPassword } from '@/lib/encryption';
import { checkPasswordBreach, checkServiceBreach } from '@/lib/breach-checker';
import { sendEmail, generateBreachAlertEmail } from '@/lib/email';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const password = await prisma.passwordEntry.findUnique({
      where: { id },
      include: {
        breachAlerts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!password) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
      );
    }

    if (password.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ...password,
      password: decryptPassword(password.passwordHash),
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching password:', error);
    return NextResponse.json(
      { error: 'Failed to fetch password' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { serviceName, username, password, url, notes, isResolved } = body;

    const existing = await prisma.passwordEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updateData: any = {
      serviceName: serviceName || existing.serviceName,
      username: username !== undefined ? username : existing.username,
      url: url !== undefined ? url : existing.url,
      notes: notes !== undefined ? notes : existing.notes,
      lastChecked: new Date(),
    };

    if (password) {
      updateData.passwordHash = encryptPassword(password);
      updateData.lastPasswordChange = new Date();
      updateData.passwordAge = 0;
      
      // Calculate new expiration date (90 days from now)
      const passwordExpiresAt = new Date();
      passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 90);
      updateData.passwordExpiresAt = passwordExpiresAt;
      
      // Re-check for breaches if password changed
      const passwordBreach = await checkPasswordBreach(password);
      const serviceBreach = await checkServiceBreach(updateData.serviceName);

      const isBreached = passwordBreach.found || serviceBreach.found;
      const breachDetails = [
        ...(passwordBreach.found ? passwordBreach.breachDetails || [] : []),
        ...(serviceBreach.found ? serviceBreach.breachDetails || [] : []),
      ];

      updateData.isBreached = isBreached;
      updateData.breachDetails = breachDetails.length > 0 ? JSON.stringify(breachDetails) : null;
      updateData.isResolved = false;
      updateData.resolvedAt = null;

      if (isBreached && !existing.isBreached) {
        await prisma.breachAlert.create({
          data: {
            passwordEntryId: id,
            breachSource: breachDetails.join(', '),
            breachDate: new Date(),
          },
        });

        const notificationEmail = process.env.NOTIFICATION_EMAIL;
        if (notificationEmail) {
          await sendEmail({
            to: notificationEmail,
            subject: `🚨 Security Alert: Password Breach Detected for ${updateData.serviceName}`,
            html: generateBreachAlertEmail(updateData.serviceName, breachDetails, id),
          });
        }
      }
    }

    if (isResolved !== undefined) {
      updateData.isResolved = isResolved;
      updateData.resolvedAt = isResolved ? new Date() : null;
    }

    const updated = await prisma.passwordEntry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...updated,
      password: decryptPassword(updated.passwordHash),
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    
    const existing = await prisma.passwordEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.passwordEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error deleting password:', error);
    return NextResponse.json(
      { error: 'Failed to delete password entry' },
      { status: 500 }
    );
  }
}

