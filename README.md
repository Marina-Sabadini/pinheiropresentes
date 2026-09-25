# Pinheiro Presentes

Site institucional da loja da dona Amália, em Fernandópolis. Feito com **HTML, CSS e JavaScript puro**.

HTML, scripts, imagens, ícones e fontes estão no próprio projeto. 

## Avaliações no pinheiro

A lista pública `avaliacoes` começa vazia. Os seis cards de convite formam a árvore original em três níveis: um, dois e três. “Pendurar aqui” escolhe o lugar do comentário. Ao salvar, o card recebe o texto, com um movimento curto de bilhete se acomodando. Clicar no comentário abre a leitura ampliada. “Ver a animação de pendurar” demonstra apenas o movimento, sem criar depoimento.

O formulário permite pendurar até 30 comentários **somente neste navegador**. Nada é enviado à loja, ao WhatsApp ou a um servidor. Cada comentário local pode ser aberto e retirado após confirmação. 

Avaliações reais autorizadas podem ser incluídas manualmente no arquivo com a autorização do cliente.

Use nomes de até 50 caracteres e textos de até 600 caracteres. A árvore mostra seis espaços por página. A posição escolhida é salva no campo `lugar`; registros anteriores, sem esse campo, continuam funcionando e recebem uma posição disponível. A opção “Ler em lista” mostra todos os comentários. Em 130% de tamanho de letra, a lista é usada automaticamente; no celular, os cards ficam em coluna para manter a leitura. Movimento reduzido elimina o balanço e a expansão animada.

No tema escuro, a cascata dos cards usa verdes progressivamente mais profundos. A neve cai continuamente sobre a logo; os brilhos na árvore são breves. Os efeitos são desativados em alto contraste e com redução de movimentos, e pausados enquanto um diálogo estiver aberto ou a aba estiver oculta. A logo não possui mais base branca no tema escuro. 

## Contato e localização

- WhatsApp preservado: **55 17 98833-1185**.
- Endereço: **Rua Carlos Gomes, 280, Jardim do Trevo, Fernandópolis – SP**.
- Há apenas um botão que abre o WhatsApp, na navegação, também visível no celular. Outros atalhos internos levam até esse contato.
  
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

- [Integração oficial VLibras](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html).

As referências orientaram a organização; layout, textos e código foram preparados para a Pinheiro Presentes. Não há dependência de um framework de UI.
