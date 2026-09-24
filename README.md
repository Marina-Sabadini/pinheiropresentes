# Pinheiro Presentes

Site institucional da loja da dona Amália, em Fernandópolis. Feito com **HTML, CSS e JavaScript puro**, sem build, cadastro, carrinho, banco de dados ou publicação automática.

## Documentação para estudo

Comece pelo [guia de documentação](docs/README.md). Ele reúne o [processo e as decisões](docs/PROCESSO-E-DECISOES.md), a [arquitetura](docs/ARQUITETURA.md), a [estrutura visual com capturas](docs/ESTRUTURA-VISUAL.md), as [regras de acessibilidade e movimento](docs/ACESSIBILIDADE-E-MOVIMENTO.md) e o [roteiro de manutenção e exercícios](docs/MANUTENCAO-E-ESTUDO.md).

Os cinco backups existentes foram reunidos em [BKP](BKP/), com instruções e hashes de integridade. Não inclua essa pasta na distribuição pública do site nem dentro dos próximos ZIPs.

## Abrir o site

Abra `index.html` em um navegador atualizado. Para uma prévia via HTTP, execute na pasta do projeto:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Depois visite `http://127.0.0.1:4173`. No VS Code, também é possível usar Live Server. Sirva somente a pasta do projeto; o PDF fica fora dela. Os backups estão agora em `BKP`, dentro da raiz, e podem ser acessados pelo servidor local. Exclua essa pasta de qualquer futura publicação.

HTML, scripts, imagens, ícones e fontes estão no próprio projeto. A árvore é formada por cards de texto, com animações nativas de CSS/JavaScript. Funciona também ao abrir diretamente `index.html`; não usa mais Three.js ou WebGL. WhatsApp, Google Maps e VLibras precisam de internet. Nada foi registrado ou publicado.

## Onde alterar cada coisa

| Arquivo                         | Conteúdo                                                               |
| ------------------------------- | ---------------------------------------------------------------------- |
| `index.html`                    | História, endereço, perguntas frequentes, textos e estrutura da página |
| `js/conteudo.js`                | Produtos, imagens, categorias, WhatsApp e avaliações autorizadas       |
| `js/script.js`                  | Busca, filtros, detalhes de produtos, navegação e links                |
| `js/acessibilidade.js`          | Preferências de leitura e integração VLibras                           |
| `js/arvore.js`                  | Comentários, armazenamento local, lista, paginação e diálogos          |
| `js/noite.js` e `css/noite.css` | Cascata de verdes noturnos, neve contínua e brilhos breves             |
| `css/arvore.css`                | Árvore de cards, formulário e leitura de comentários                   |
| `css/melhorias.css`             | Logo ampliada, navegação, régua e novos contrastes                     |
| `css/index.css`                 | Cores, layout, componentes, temas, celular e impressão                 |
| `css/fontes.css` e `fontes/`    | Fontes locais Fraunces e Manrope, com licenças OFL                     |
| `imagens/`                      | Logo, fotos de teste e fotos extraídas do PDF fornecido                |

## Trocar fotos e cadastrar produtos

1. Salve a nova foto em `imagens/`, preferindo nomes sem espaços, como `jogo-de-cama-azul.jpg`.
2. Abra `js/conteudo.js` e encontre o produto correspondente.
3. Altere `imagem` e `alt`. A descrição alternativa precisa explicar o que realmente aparece na foto.
4. Altere `imagemTeste` para `false` quando a imagem for do produto real.

Exemplo de um objeto dentro da lista `produtos`:

```js
{
  id: 'jogo-de-cama-azul', // Único; não repetir em outros produtos.
  nome: 'Jogo de cama azul',
  categoria: 'casa',
  resumo: 'Conforto para o seu descanso.',
  descricao: 'Descreva aqui as características reais do produto.',
  imagem: 'imagens/jogo-de-cama-azul.jpg',
  alt: 'Jogo de cama azul-claro com duas fronhas sobre uma cama de casal.',
  imagemTeste: false
}
```

Mantenha a vírgula entre os objetos. As categorias existentes são `casa`, `roupas`, `perfumes`, `maquiagem` e `presentes`. Os filtros e a busca acompanham os produtos automaticamente. Para incluir uma categoria nova, acrescente seu nome em `categorias` e seu botão em `index.html`, usando o mesmo identificador em `data-filter`.

Os arquivos Teste1 a Teste5 foram preservados e usados como solicitado. São fotografias de gatinhos, identificadas como imagens de teste. Não representam os produtos comercializados. As duas fotos institucionais foram extraídas do PDF sem incluir dados cadastrais ou assinaturas do documento.

## Avaliações no pinheiro

A lista pública `avaliacoes` começa vazia. Os seis cards de convite formam a árvore original em três níveis: um, dois e três. “Pendurar aqui” escolhe o lugar do comentário. Ao salvar, o card recebe o texto, com um movimento curto de bilhete se acomodando. Clicar no comentário abre a leitura ampliada. “Ver a animação de pendurar” demonstra apenas o movimento, sem criar depoimento.

O formulário permite pendurar até 30 comentários **somente neste navegador**, guardados em `localStorage` na chave `pinheiro-comentarios-v1`. Nada é enviado à loja, ao WhatsApp ou a um servidor. Cada comentário local pode ser aberto e retirado após confirmação. Limpar os dados do navegador apaga esses comentários; outro dispositivo ou endereço de acesso não compartilha a lista. Se o armazenamento estiver indisponível, o comentário fica apenas na memória da visita, com aviso visível.

Para publicação compartilhada, será necessário um serviço de armazenamento e moderação. Esta entrega mantém a stack estática solicitada. Avaliações reais autorizadas podem ser incluídas manualmente no arquivo abaixo.

Depois de receber uma avaliação real e a autorização do cliente, adicione:

```js
avaliacoes: [
  {
    nome: "Nome autorizado pelo cliente",
    texto: "Texto real da avaliação recebida.",
    cor: "dourado", // dourado, verde ou azul; opcional
  },
];
```

Use nomes de até 50 caracteres e textos de até 600 caracteres. A árvore mostra seis espaços por página. A posição escolhida é salva no campo `lugar`; registros anteriores, sem esse campo, continuam funcionando e recebem uma posição disponível. A opção “Ler em lista” mostra todos os comentários. Em 130% de tamanho de letra, a lista é usada automaticamente; no celular, os cards ficam em coluna para manter a leitura. Movimento reduzido elimina o balanço e a expansão animada.

No tema escuro, a cascata dos cards usa verdes progressivamente mais profundos. A neve cai continuamente sobre a logo; os brilhos na árvore são breves. Os efeitos são desativados em alto contraste e com redução de movimentos, e pausados enquanto um diálogo estiver aberto ou a aba estiver oculta. A logo não possui mais base branca no tema escuro. Veja as cores, os gatilhos e as referências em `docs/ACOLHIMENTO-E-CORES.md` e `docs/INTERACAO-CARDS.md`.

## Contato e localização

- WhatsApp preservado: **55 17 98833-1185**.
- Endereço: **Rua Carlos Gomes, 280, Jardim do Trevo, Fernandópolis – SP**.
- Horários não foram fornecidos; o site orienta confirmar diretamente com a Amália.
- Há apenas um botão que abre o WhatsApp, na navegação, também visível no celular. Outros atalhos internos levam até esse contato. Ao trocar o telefone, altere `whatsapp` em `js/conteudo.js` e o único link `https://wa.me/` no HTML, além do número visível no rodapé.
- Ao trocar o endereço, atualize o texto, o título e o `src` do iframe e os dois links para o Maps em `index.html`.

## Acessibilidade

- Idioma pt-BR, landmarks semânticos, títulos em hierarquia, descrições de imagens e nomes acessíveis nos controles.
- Link para pular ao conteúdo, foco visível, navegação por teclado, indicação da seção atual e menu com estado anunciado.
- Ampliação de texto entre 100% e 200% (em passos de 10%). O zoom nativo do navegador continua habilitado.
- Temas claro, escuro e do sistema; alto contraste claro (preto no branco) ou escuro (branco no preto e destaque amarelo); links sublinhados; redução de movimentos respeitando também a configuração do dispositivo.
- Régua de leitura acompanha ponteiro e foco, sem bloquear cliques. A posição também pode ser ajustada no painel ou por Ctrl+Alt+↑/↓. A régua fica oculta enquanto um diálogo está aberto.
- Atalhos opcionais: Ctrl+Alt+= aumenta letras; Ctrl+Alt+− diminui; Ctrl+Alt+0 restaura o tamanho; Ctrl+Alt+A abre acessibilidade; Ctrl+Alt+R alterna a régua. Campos de texto e AltGr são preservados. Desative os atalhos no painel se houver conflito com tecnologia assistiva.
- Preferências guardadas em `localStorage`, sem conta ou envio ao servidor. Se o armazenamento estiver bloqueado, os ajustes continuam funcionando durante a visita.
- Diálogos nativos com foco contido, fechamento por Escape e retorno ao acionador.
- Resultados de busca anunciados sem deslocar o foco; busca sem distinção de acentos.
- VLibras integrado pelo script oficial, com carregamento assíncrono e estado de erro. Na versão atual, o widget se inicializa automaticamente.

As verificações automáticas e manuais estão descritas em `docs/VERIFICACAO.md`. Elas não equivalem a uma certificação integral de acessibilidade. Uma avaliação com leitores de tela e clientes idosos é a próxima validação apropriada. Os serviços externos também podem ter limitações próprias.

## Backup original

Antes da primeira alteração, foi criado e conferido o arquivo:

`C:\Users\Marina_saba\Desktop\PEX4\BKP\PEX4-backup-20260919-203337.zip`

Ele contém os nove arquivos do projeto original. Para consultar ou recuperar, extraia em **outra pasta**; evite sobrescrever esta versão sem antes copiá-la.

Antes da segunda revisão foi criado `C:\Users\Marina_saba\Desktop\PEX4\BKP\PEX4-backup-20260919-214130.zip`, com 27 arquivos.

## Logo com transparência

`imagens/logo-transparente.png` é a versão aprimorada com IA, em PNG RGBA de 1221 × 1289 pixels, com transparência real. O arquivo original `imagens/Logo.png` foi preservado. Processo e instrução de edição estão em `docs/LOGO-IA.md`.

## Referências

- Identidade, história e fotos: PDF `PEX4.pdf` fornecido para o projeto.
- Organização por categorias: [Natura](https://www.natura.com.br/c/perfumaria-feminina) e [Zara Home](https://www.zara.com/br/pt/home-mkt2085.html).
- [Critérios WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/).
- [Integração oficial VLibras](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html).

As referências orientaram a organização; layout, textos e código foram preparados para a Pinheiro Presentes. Não há dependência de um framework de UI.

## Revisão dos cards e tema noturno

Backup anterior: `C:\Users\Marina_saba\Desktop\PEX4\BKP\PEX4-backup-cards-20260919-221938.zip`. `css/noite.css` e `js/noite.js` controlam os detalhes noturnos. O PDF original permanece inalterado; `docs/ACOLHIMENTO-E-CORES.md` é um complemento separado.
