const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function crearMaterialPuzzleAnimales() {
  try {
    console.log('🔧 Creando material PUZZLE ANIMALES...');

    // Buscar el producto existente
    const producto = await prisma.lab_product.findFirst({
      where: {
        name: {
          contains: 'Laboratorio movil de Parvulo',
          mode: 'insensitive'
        }
      }
    });

    if (!producto) {
      console.log('❌ No se encontró el producto Laboratorio movil de Parvulo');
      return;
    }

    console.log(`✅ Producto encontrado: ${producto.name} (ID: ${producto.id})`);

    // Crear el material PUZZLE ANIMALES
    const material = await prisma.lab_material.upsert({
      where: {
        internal_code: 'puzzle-animales'
      },
      update: {
        name: 'PUZZLE ANIMALES',
        lab_product_id: producto.id,
        specifications: {
          description: 'Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder',
          category: 'PUZZLE ANIMALES',
          thematic_axis: 'VIDA Y RELACIONES'
        }
      },
      create: {
        name: 'PUZZLE ANIMALES',
        internal_code: 'puzzle-animales',
        lab_product_id: producto.id,
        specifications: {
          description: 'Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder',
          category: 'PUZZLE ANIMALES',
          thematic_axis: 'VIDA Y RELACIONES'
        }
      }
    });

    console.log(`✅ Material creado: ${material.name} (ID: ${material.id})`);
    console.log('✅ Material PUZZLE ANIMALES creado exitosamente!');

  } catch (error) {
    console.error('❌ Error creando material:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearMaterialPuzzleAnimales(); 