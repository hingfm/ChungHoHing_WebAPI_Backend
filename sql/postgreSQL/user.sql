CREATE TABLE public.users (
	id serial,
	firstname varchar(32) NULL,
	lastname varchar(32) NULL,
	username varchar(16) NOT NULL,
	about text NULL,
	dateregistered timestamp NOT NULL DEFAULT now(),
	"password" varchar(32) NULL,
	passwordsalt varchar(16) NULL,
	email varchar(64) NOT NULL,
	avatarurl varchar(64) NULL,
  	role text, 
	region text,
	google_id VARCHAR(255) UNIQUE,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username)
);



INSERT INTO users (username, email, password, role, region) VALUES
	('alice', 'alice@example.com', '123456', 'admin', 'Mong Kok', ''),
	('bob', 'bob@example.com','123456', 'user', 'Sha Tin', ''),
	('colin', 'colin@example.com','123456', 'user', 'Chai Wan', ''),
	('cycheng', 'cycheng@example.com','654321', 'admin', 'Sha Tin', '');