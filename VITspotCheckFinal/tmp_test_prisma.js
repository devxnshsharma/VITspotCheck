const { PrismaClient } = require('@prisma/client')
// Prisma v6 works with default constructor
const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log('Successfully connected and queried users:', users.length)
  } catch (e) {
    console.error('Runtime Prisma Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
