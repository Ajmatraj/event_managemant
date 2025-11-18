/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatarUrl_Id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
ADD COLUMN     "avatarUrl_Id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarUrl_Id_key" ON "User"("avatarUrl_Id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarUrl_Id_fkey" FOREIGN KEY ("avatarUrl_Id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
