-- AlterTable
ALTER TABLE "PasswordEntry" ADD COLUMN     "lastPasswordChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordAge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passwordExpiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastPasswordChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "PasswordEntry_passwordExpiresAt_idx" ON "PasswordEntry"("passwordExpiresAt");
