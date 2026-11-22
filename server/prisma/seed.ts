import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados Fiore...');

  // 1. Criar Categorias padrão se não existirem
  const categoriasPadrao = ['Floral', 'Amadeirado', 'Cítrico', 'Oriental'];
  const categoriasCriadas = [];

  for (const nome of categoriasPadrao) {
    let cat = await prisma.categoria.findFirst({ where: { nome } });
    if (!cat) {
      cat = await prisma.categoria.create({ data: { nome } });
      console.log(`✓ Categoria criada: ${nome}`);
    }
    categoriasCriadas.push(cat);
  }

  // 2. Criar ou Atualizar Usuário Administrador
  const adminEmail = 'admin@fiore.com';
  const adminSenhaHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {
      tipo_usuario: TipoUsuario.ADMIN,
    },
    create: {
      nome: 'Administrador Fiore',
      email: adminEmail,
      senha: adminSenhaHash,
      endereco: 'Av. Santos Dumont, 1000 - Fortaleza, CE',
      telefone: '85999990000',
      tipo_usuario: TipoUsuario.ADMIN,
    },
  });

  console.log(`✓ Administrador pronto: ${admin.email} (tipo: ${admin.tipo_usuario})`);

  // 3. Criar produtos de exemplo com estoque se não houver produtos cadastrados
  const totalProdutos = await prisma.produto.count();
  if (totalProdutos === 0 && categoriasCriadas.length > 0) {
    const catFloral = categoriasCriadas[0];
    const catAmadeirado = categoriasCriadas[1];

    await prisma.produto.createMany({
      data: [
        {
          nome: 'Rose Absolute',
          descricao_olfativa: 'Notas envolventes de rosas de Grasse com toque suave de baunilha.',
          preco: 289.90,
          quantidade_estoque: 15,
          imagem_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60',
          id_categoria: catFloral.id_categoria,
        },
        {
          nome: 'Bois De Santal',
          descricao_olfativa: 'Acorde amadeirado intenso de sândalo nobre com especiarias orientais.',
          preco: 349.00,
          quantidade_estoque: 10,
          imagem_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=60',
          id_categoria: catAmadeirado.id_categoria,
        },
        {
          nome: 'Fleur Blanche',
          descricao_olfativa: 'Jasmim fresco e lírio do vale com fundo almiscarado e luminoso.',
          preco: 245.50,
          quantidade_estoque: 8,
          imagem_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60',
          id_categoria: catFloral.id_categoria,
        },
      ],
    });
    console.log('✓ Produtos iniciais criados com estoque.');
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
