#  AgroPetReis

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/Miguel-Olimpio/AgroPetReis/blob/main/LICENSE) 

## IDEALIZAÇÃO DO PROJETO
Este projeto teve origem como uma solução de automação para uma agropecuária localizada em Juiz de Fora, MG. A cliente, uma veterinária que conduz consultas em sua agropecuária, abordou-me com um desafio recorrente: todo mês, ela precisava consultar sua agenda para identificar os animais que necessitavam de uma segunda dose de vacina ou de uma nova consulta. Isso exigia que ela entrasse em contato com os clientes individualmente para enviar mensagens de confirmação, além de enfrentar dificuldades com a confirmação de agendamentos de forma tradicional.

Inicialmente, desenvolvi uma solução em Python [Clique aqui para acessar o repósitorio](AgroPetReis-1924190082.us-east-1.elb.amazonaws.com) para abordar esses problemas. Entretanto, ela expressou interesse em uma abordagem mais abrangente: um site que permitisse aos próprios clientes agendar suas consultas, integrado com a automação em Python que originalmente lia os dados de tabelas no Excel e agora os extrai diretamente deste site.

Apesar das limitações impostas pela cliente - que preferiu não implementar um sistema de login devido ao perfil predominantemente idoso e, muitas vezes, menos familiarizado com a tecnologia entre seus clientes - propus a inclusão de um sistema de login baseado nos nomes e números de telefone (WhatsApp). Anteriormente, os clientes agendavam consultas para seus pets através do WhatsApp. Assim, foram adicionadas diversas funcionalidades ao projeto, as quais podem ser exploradas nos tópicos a seguir.

O site se encontra hospedado na AWS, onde optei por não coloca-lo como HTTPS, por motivos de custo e a não necessidade de estar indexado pelo google, pois o site é sugerido sempre que uma conversa é iniciada com o WhatsApp da loja, no entanto foram configurado todos os securit groups de modo que o site se mantivesse da maneira mais segura possível, onde foi configurado o load balancer entre outras configurações no console da AWS.

[Clique aqui](AgroPetReis-1924190082.us-east-1.elb.amazonaws.com) para visualizar o site.

## Layout web
Na imagem abaixo, apresentamos a página inicial do site. No cabeçalho, destacam-se os seguintes itens: Entrar, Registrar, Calendário, e a logomarca do cliente, destacada por uma seta, que representa a opção de acesso para o administrador. É importante notar que no calendário, somente os dias em que o veterinário está disponível para consulta podem ser clicados, ou seja, de terça-feira a sábado. Além disso, é possível visualizar os meses subsequentes e retornar ao mês atual.

![image1](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/cbe6f012-a4d4-4bb4-b904-e02d7e2357d5)

A imagem abaixo retrata a tela de login do usuário. Por solicitação do contratante, o sistema de login foi concebido para ser simples, evitando a necessidade de senhas. Esta abordagem visa atender aos clientes, muitas vezes idosos e não familiarizados com tecnologia avançada. Assim, o acesso do usuário é realizado com base no número de telefone do WhatsApp e seus respectivos nomes e sobrenomes, com todas as letras iniciais em maiúsculas por padrão.

![image2](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/813590ff-06b6-4dd1-a97f-dd858a364f2f)

A imagem abaixo ilustra a interface após o login do usuário, oferecendo uma variedade de funcionalidades. Aqui, é possível cadastrar os pets, visualizar fichas veterinárias, e modificar dados do usuário, como número de telefone ou nome, caso haja algum erro. Essas funcionalidades foram projetadas para facilitar a interação com o contratante, permitindo que os donos de pets atendidos pelo veterinário acessem laudos, receitas, datas de vacinação, entre outras informações relevantes.

Esse acesso online proporciona uma maneira conveniente de acesso às informações que, de outra forma, poderiam se perder ou ser esquecidas pelos clientes. Além disso, reduz o trabalho do veterinário ao responder a perguntas como 'Como aplicar o medicamento a cada 8 horas na nuca do animal', pois essas instruções estarão disponíveis nos laudos online.

![image3](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/07b3c751-da01-43b6-be11-231c0a9d1c9e)

![image4](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/a5b41aec-cde9-4d47-842d-3e7a24448893)

A imagem abaixo mostra a interface de agendamento, na qual os horários disponíveis estão destacados em verde. Neste estágio, o projeto acabou de ser entregue e ainda não está totalmente operacional. No entanto, com o tempo, será possível visualizar o sistema em funcionamento, caso haja interesse.

Quando um horário está agendado, tanto o administrador quanto o usuário têm a capacidade de cancelar o agendamento nesta tela. No entanto, somente os usuários que realizaram o agendamento podem confirmá-lo, mediante um formulário de confirmação que é aberto após a seleção do horário. Horários ocupados não podem ser selecionados por outros usuários. Além disso, cada usuário só pode agendar um horário por pet, pois o formulário de confirmação requer informações específicas do animal

![image5](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/f54ef5cd-f4b1-41f9-ada8-440c3c86f853)

![image6](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/1ef93cf4-9939-45f3-a57f-2bf1a2b0f858)

Embora haja várias outras funcionalidades disponíveis para o usuário, não é necessário abordá-las individualmente aqui, pois são recursos padrão comuns neste tipo de aplicação. No entanto, a partir deste ponto, vamos focar nas funcionalidades destinadas ao administrador do site.

O administrador possui um sistema de login que requer um nome de usuário e uma senha criptografada com bcrypt. Além disso, o cabeçalho da página apresenta um menu diferente, oferecendo acesso a um gerenciador, semelhante à interface de calendário do usuário. Também há uma seção chamada 'Pacientes', onde é possível pesquisar pelo nome do usuário para localizar um animal específico. Isso é importante, já que o veterinário contratante atende um número considerável de clientes, variando entre 80 e 150. Sem essa funcionalidade de pesquisa, localizar um usuário ou animal específico seria uma tarefa difícil devido ao volume de clientes atendidos.

![image8](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/e612ba31-5eaf-4917-9268-9af4a8d75fd3)

![image7](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/f126ed7c-baa5-4a7a-b4af-1f40c42508dd)

Logo em seguida, é possível visualizar as consultas agendadas, sendo que cada consulta é removida da tela assim que é concluída. Nessa seção, os usuários podem preencher as fichas veterinárias com todas as informações necessárias. Além disso, há um botão que permite ao administrador verificar se há vacinas vencidas para o dia atual.

Conforme mencionado anteriormente, este projeto deve ser utilizado em conjunto com outro desenvolvido em Python, responsável por alertar os clientes sobre vacinas vencidas, entre outras funcionalidades. O projeto Python pode ser visualizado --> link do projeto em python quando estiver no github".

![image9](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/a45c9d2a-214a-4035-aee6-93b8ede0c83d)

![image10](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/e3f37233-ab2f-4b28-95ba-2f407347dfff)

## Layout mobile
### Layoute Padrão mobile
> ![imagemPadrao](https://private-user-images.githubusercontent.com/107503116/309641875-484c1b35-72d4-44f6-8c54-eea1c95237a1.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDk1MzE1NDksIm5iZiI6MTcwOTUzMTI0OSwicGF0aCI6Ii8xMDc1MDMxMTYvMzA5NjQxODc1LTQ4NGMxYjM1LTcyZDQtNDRmNi04YzU0LWVlYTFjOTUyMzdhMS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzA0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMwNFQwNTQ3MjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00ZjI4MjcwMWQzYzg5ZTFkNGE5MWYxZmJmMGRkYzZhNGEyMDkwMDIyOGQ1ZTE0ZjJlYmFmZjUyZTgyYzY4OWFiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.zUSsUSN2Nn0JzpXFQ_T3La5KVSabFYNYiBrKrn-8X3U)

### Layout usuario mobile

![imagemPetsAgendamento](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/441c3901-ff57-46cb-9a2f-488130fe0ab8)

### Layout aministrador mobile

![imagemAdmPages](https://github.com/Miguel-Olimpio/AgroPetReis/assets/107503116/6d1eb433-f9ec-4625-8c9a-73733d91aa09)

# Tecnologias utilizadas
## Back end
- Noje.js
- MYSQL
## Front end
- Handlebars
- CSS
## Implantação em produção
- Back end: AWS
- Front end web: AWS
- Banco de dados: AWS RDS

# Como executar o projeto

## Back end
Pré-requisitos: Node.js 18.17.1
Obs: é necessário a utilização de banco de dados no projeto, logo para rodar o projeto localmente é necessário criar o banco de dados MYSQL e simula-lo, quando o projeto estava sendo feito foi utilizando o XAMP e o MYSQL Workbanch

```bash
# clonar repositório
git clone https://github.com/Miguel-Olimpio/AgroPetReis.git

# entrar na pasta do projeto back end
cd AgroPetReis

Alterar as informações nos arquivos conn.js e criar um arquivo .env semelhante ao arquivo .envExample e inserir os dados de seu banco de dados local ou em produção.

# instalar dependências
npm install

# executar o projeto
npm run dev
```

# Autor

Miguel Olimpio de Paula Netto

https://www.linkedin.com/in/miguel-olimpio-ba3220200/


