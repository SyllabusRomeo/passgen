-- CreateTable
CREATE TABLE "PasswordEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceName" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "url" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastChecked" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBreached" BOOLEAN NOT NULL DEFAULT false,
    "breachDetails" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" DATETIME
);

-- CreateTable
CREATE TABLE "BreachAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passwordEntryId" TEXT NOT NULL,
    "breachSource" TEXT NOT NULL,
    "breachDate" DATETIME,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BreachAlert_passwordEntryId_fkey" FOREIGN KEY ("passwordEntryId") REFERENCES "PasswordEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PasswordEntry_serviceName_idx" ON "PasswordEntry"("serviceName");

-- CreateIndex
CREATE INDEX "PasswordEntry_isBreached_idx" ON "PasswordEntry"("isBreached");

-- CreateIndex
CREATE INDEX "BreachAlert_passwordEntryId_idx" ON "BreachAlert"("passwordEntryId");
