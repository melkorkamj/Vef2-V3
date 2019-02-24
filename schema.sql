CREATE TABLE applications (
  id serial primary key,
  name varchar(128) not null,
  email varchar(256) not null,
  phone int not null,
  text text,
  job varchar(64) not null,
  processed boolean default false,
  created timestamp not null DEFAULT current_timestamp,
  updated timestamp not null DEFAULT current_timestamp
);

CREATE TABLE users (
  id serial primary key,
  name varchar(64) not null,
  email varchar(256) not null,
  username character varying(255) not null,
  password character varying(255) not null,
  admin boolean default false
);
