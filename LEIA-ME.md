# AMEIN – pacote de atualização (outubro de 2026)

## O que tem neste pacote
| Arquivo | Para que serve |
|---|---|
| `index.html` | O site com todas as melhorias (substitui o atual) |
| `premium.sql` | Cria a tabela dos códigos Premium no Supabase (rodar 1 vez) |
| `gerador-voz.html` | Sua ferramenta para gerar a voz profissional (só você usa) |
| `audio/vozes.json` | Lista das orações que já têm voz profissional (começa vazia) |
| `manifest.webmanifest`, `sw.js`, `icon-*.png`, `apple-touch-icon.png` | Fazem o site virar "app instalável" no celular |
| `_headers` | Regras de cache do Netlify |

**Importante:** este pacote não traz as imagens que você já tem no site (`og.jpg`, `pix.png`, fotos dos santos, logos de apoiadores). Copie estes arquivos **por cima** da pasta que você já usa, sem apagar nada.

## Ordem para publicar
1. **Supabase** → SQL Editor → New query → cole o conteúdo de `premium.sql` → Run.
2. Copie os arquivos deste pacote para a pasta do site (substituindo o `index.html`).
3. Publique no Netlify (ou envie para o GitHub, se já tiver ligado).
4. Teste: entre no Painel como administrador. No fim da página aparece **Premium dos apoiadores**. Gere um código de teste, abra `amein.com.br/#premium` numa janela anônima e ative.

## Como liberar o Premium para quem apoiou
1. A pessoa apoia (Pix, plano ou valor livre) e manda o comprovante.
2. Você abre o **Painel** → **Premium dos apoiadores** → preenche nome, contato, valor e validade → **Gerar código**.
3. Toque em **Enviar no WhatsApp**: a mensagem já vai pronta com o código e o link.
4. Para cancelar um código, toque em **Desativar** (o aparelho da pessoa perde o Premium em até 3 dias).

## Voz profissional (primeira vez)
1. Crie uma conta gratuita em portal.azure.com.
2. Crie um recurso **Speech** (Serviço de Fala), plano **Free F0**, região **Brazil South**.
3. Em **Keys and Endpoint**, copie a **KEY 1** e a **Location/Region**.
4. Depois de publicar o site, abra `amein.com.br/gerador-voz.html`, cole a chave e a região e clique em **Ouvir amostra**.
5. Pai Nosso, Ave Maria e São Francisco já vêm marcados. Clique em **Gerar áudios marcados**, ouça e clique em **Baixar pacote .zip**.
6. Descompacte, copie os arquivos da pasta `audio` do pacote para a pasta `audio` do site (escolha **substituir**) e publique.

O plano gratuito do Azure dá 500 mil caracteres por mês. Todas as orações e santos do site juntos usam bem menos que isso.

### Para dar voz a novas orações ou santos depois
Abra o gerador, clique em **Marcar as que faltam** (ou marque só as que quiser), gere, baixe e publique.
Se você **mudar o texto** de uma oração que já tem voz, o site volta a usar a voz padrão nela até você gerar de novo (aparece "texto mudou" no gerador).

## O que mudou no site
- Botão de cores agora diz **🎨 Mudar cor**.
- A marca d'água em diagonal virou uma faixa fina no topo.
- Voz **Padrão**: escolhe sozinha a voz mais natural do aparelho.
- **AMEIN Premium** (página `#premium`): todo apoio libera a voz profissional.
- **App instalável**: botão "Instalar o AMEIN no celular" no Android e instruções no iPhone. As orações abrem até sem internet.
- Termos e privacidade: novo parágrafo sobre os dados do Premium.
