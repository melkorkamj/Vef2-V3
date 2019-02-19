CREATE TABLE applications (
  id serial primary key,
  name varchar(128) not null,
  email varchar(256) not null,
  phone int not null,
  text text,
  job varchar(64) not null,
  processed boolean default false,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);

CREATE TABLE users (
  id serial primary key,
  username varchar(128) not null,
  password varchar(128) not null,
  name varchar(64) not null,
  email varchar(256) not null,
  admin boolean default false
);
