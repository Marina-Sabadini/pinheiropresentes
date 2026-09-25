/* EDITE A VITRINE AQUI. Não é necessário alterar a lógica do site.
 * imagem: caminho a partir de index.html; alt: descrição real da foto.
 * Ao substituir a foto de teste, mude imagemTeste para false.
 * Categorias: casa, roupas, perfumes, maquiagem, presentes.
 */
window.LOJA = {
  nome: "Pinheiro Presentes",
  whatsapp: "5517988331185",
  categorias: {
    casa: "Cama, mesa e banho",
    roupas: "Roupas e íntimos",
    perfumes: "Perfumes",
    maquiagem: "Maquiagem",
    presentes: "Presentes e mais",
  },
  produtos: [
    {
      id: "lencois",
      nome: "Lençóis e jogos de cama",
      categoria: "casa",
      resumo: "Um convite para descansar bem.",
      descricao:
        "Lençóis e jogos de cama para deixar seu quarto mais acolhedor. Converse com a Amália para conhecer os modelos, tecidos e medidas disponíveis.",
      imagem: "imagens/fronhas.jpeg",
      alt: "Foto de teste: um gatinho cinza e branco sentado na grama.",
      imagemTeste: false,
    },
    {
      id: "perfumes",
      nome: "Perfumes e colônias",
      categoria: "perfumes",
      resumo: "Um cheirinho que fica na memória.",
      descricao:
        "Fragrâncias para o dia a dia e para presentear. A Amália pode ajudar você a escolher e informar as marcas e opções disponíveis.",
      imagem: "imagens/perfumaria.jpeg",
      alt: "Foto de teste: um grupo de filhotes de gato sobre a grama.",
      imagemTeste: false,
    },
    {
      id: "roupas",
      nome: "Roupas e moda íntima",
      categoria: "roupas",
      resumo: "Conforto para acompanhar você.",
      descricao:
        "Peças para o cotidiano, incluindo sutiãs, calcinhas e cuecas. Consulte tamanhos, cores e modelos com a Amália.",
      imagem: "imagens/Teste3.jpg",
      alt: "Foto de teste: três gatinhos juntos no jardim.",
      imagemTeste: true,
    },
    {
      id: "maquiagem",
      nome: "Maquiagem e beleza",
      categoria: "maquiagem",
      resumo: "Seu momento de se cuidar.",
      descricao:
        "Itens de maquiagem para completar seus cuidados. Pergunte à Amália quais produtos e tonalidades estão disponíveis.",
      imagem: "imagens/maquiagem.jpeg",
      alt: "Foto de teste: três filhotes de gato entre flores e folhas.",
      imagemTeste: false,
    },
    {
      id: "presentes",
      nome: "Presentes e utilidades",
      categoria: "presentes",
      resumo: "Pequenos detalhes, bons encontros.",
      descricao:
        "Bolsas, garrafas e copos térmicos e outros presentes para diferentes momentos. Converse com a Amália para encontrar uma opção para você.",
      imagem: "imagens/Teste5.jpg",
      alt: "Foto de teste: dois filhotes de gato, um deles olhando para a câmera.",
      imagemTeste: true,
    },
    {
      id: "banho",
      nome: "Toalhas, tapetes e almofadas",
      categoria: "casa",
      resumo: "Mais aconchego em cada cantinho.",
      descricao:
        "Artigos de cama, mesa e banho para cuidar da casa. Consulte opções de toalhas, tapetes, almofadas e cobre-leitos disponíveis na loja.",
      imagem: "imagens/Teste1.jpg",
      alt: "Foto de teste: um gatinho cinza e branco sentado na grama.",
      imagemTeste: true,
    },
  ],
  // Somente avaliações reais, com autorização para publicação.
  // Estrutura: { nome: 'Nome autorizado', texto: 'Depoimento real recebido.', cor: 'dourado' }
  // Cor opcional: dourado, verde ou azul. Nome até 50, texto até 600 caracteres.
  // Comentários feitos no formulário são locais; nunca são publicados aqui automaticamente.
  avaliacoes: [],
};
