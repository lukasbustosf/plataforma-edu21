const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.lab_product.findMany();
    console.log('Productos disponibles:');
    products.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
    
    const materials = await prisma.lab_material.findMany();
    console.log('\nMateriales disponibles:');
    materials.forEach(m => console.log(`- ${m.name} (ID: ${m.id}, Product: ${m.lab_product_id})`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts(); 