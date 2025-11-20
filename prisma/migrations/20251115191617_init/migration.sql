/*
  Warnings:

  - You are about to drop the column `components` on the `Configure` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "images" JSONB
);

-- CreateTable
CREATE TABLE "component_on_configure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configureId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "component_on_configure_configureId_fkey" FOREIGN KEY ("configureId") REFERENCES "Configure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "component_on_configure_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Configure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Configure" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "Configure";
DROP TABLE "Configure";
ALTER TABLE "new_Configure" RENAME TO "Configure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "component_on_configure_configureId_componentId_key" ON "component_on_configure"("configureId", "componentId");
