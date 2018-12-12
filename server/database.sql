drop database if exists db_tarefas;
create database db_tarefas;
use db_tarefas;

create table tarefas(
  id          int           not null  auto_increment primary key,
  descricao   varchar(200)  not null,
  data        datetime,
  realizado   tinyint       not null  default 0
);

insert into tarefas (descricao, data) values 
  ('Pagar conta de energia', '2018-10-03 10:00:00'),
  ('Inciar o trabalho de ED', '2018-10-03 12:00:00'),
  ('Abastecer o carro', '2018-10-04 00:00:00'),
  ('Pagar conta de água', '2018-11-12 10:00:00'),
  ('Entregar trabalho de ED', '2018-11-14 19:00:00'),
  ('Entregar trabalho de Meio Ambiente', '2018-11-15 19:00:00'),
  ('Entregar trabalho de Web', '2018-12-13 19:00:00'),
  ('Entregar trabalho de Metodologia Científica', '2018-11-28 19:00:00');
