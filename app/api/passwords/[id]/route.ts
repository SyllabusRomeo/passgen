import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptPassword, decryptPassword } from '@/lib/encryption';
import { checkPasswordBreach, checkServiceBreach } from '@/lib/breach-checker';
import { sendEmail, generateBreachAlertEmail } from '@/lib/email';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const password = await prisma.passwordEntry.findUnique({
      where: { id: params.id },
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

    return NextResponse.json({
      ...password,
      password: decryptPassword(password.passwordHash),
    });
  } catch (error) {
    console.error('Error fetching password:', error);
    return NextResponse.json(
      { error: 'Failed to fetch password' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { serviceName, username, password, url, notes, isResolved } = body;

    const existing = await prisma.passwordEntry.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
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
            passwordEntryId: params.id,
            breachSource: breachDetails.join(', '),
            breachDate: new Date(),
          },
        });

        const notificationEmail = process.env.NOTIFICATION_EMAIL;
        if (notificationEmail) {
          await sendEmail({
            to: notificationEmail,
            subject: `🚨 Security Alert: Password Breach Detected for ${updateData.serviceName}`,
            html: generateBreachAlertEmail(updateData.serviceName, breachDetails, params.id),
          });
        }
      }
    }

    if (isResolved !== undefined) {
      updateData.isResolved = isResolved;
      updateData.resolvedAt = isResolved ? new Date() : null;
    }

    const updated = await prisma.passwordEntry.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      ...updated,
      password: decryptPassword(updated.passwordHash),
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.passwordEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting password:', error);
    return NextResponse.json(
      { error: 'Failed to delete password entry' },
      { status: 500 }
    );
  }
}

