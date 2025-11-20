/*
  Warnings:

  - A unique constraint covering the columns `[transaction_uuid]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_transaction_uuid_key" ON "Payment"("transaction_uuid");
