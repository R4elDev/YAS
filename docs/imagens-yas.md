# Imagens da Yas

Dez recortes transparentes em `public/yas/`, produzidos com a ferramenta integrada imagegen a partir das dez imagens fornecidas em 08/11/2026. Os originais foram preservados.

Prompt aplicado individualmente a cada imagem:

> Use case: background-extraction. Edit this exact image: remove only the white background to true alpha transparency. Preserve the entire character, pose, face, glasses, hair, clothing, lettering, objects and framing unchanged. Clean antialiased edges, no white halo, no added shadow or background. Output one isolated character PNG for website use.

| Arquivo | Uso |
| --- | --- |
| convite.png | Destaque inicial |
| halter.png | Treinos personalizados |
| forca.png | Evolução |
| planejamento.png | Organização semanal |
| alongamento.png | Preparação |
| preparo.png | Concentração |
| hidratacao.png | Pausas |
| conquista.png | Chamada para entrar |
| personal.png | Login |
| jornada.png | Progresso do aluno |

Todos os PNGs têm 1122 × 1402 pixels e canal alpha com valores entre 0 e 255. O componente `YasPose` usa a otimização nativa de imagens do Next.js, tamanhos responsivos e carregamento sob demanda, exceto nas imagens principais. São ilustrações decorativas, com texto alternativo vazio para evitar repetição da informação textual.
