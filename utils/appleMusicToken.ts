import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateToken(newToken: string, expirationDate: Date) {
  try {
    const updatedToken = await prisma.appleMusicToken.upsert({
      where: { id: 1 },
      update: {
        token: newToken,
        expiresAt: expirationDate,
      },
      create: {
        token: newToken,
        expiresAt: expirationDate,
      },
    });
    console.log('Token updated successfully:', updatedToken);
    return updatedToken;
  } catch (error) {
    console.error('Error updating token:', error);
    throw error;
  }
}

export async function getToken() {
  try {
    const token = await prisma.appleMusicToken.findFirst();
    if (token) {
      return token;
    } else {
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

export async function deleteToken() {
  try {
    await prisma.appleMusicToken.deleteMany();
    console.log('All tokens deleted');
  } catch (error) {
    console.error('Error deleting tokens:', error);
    throw error;
  }
}