--@(#) script.ddl
CREATE TABLE public.users (
	id int generated always as identity primary key,
	email varchar (255) NOT NULL,
	password varchar (255) NOT NULL,
	first_name varchar (30) NOT NULL,
	last_name varchar (30) NOT NULL,
	birth_date date NOT NULL,
	phone varchar (20) NOT NULL,
	photos varchar (255) NOT NULL,
	registration_date timestamp NOT NULL,
	update_date timestamp NOT NULL,
	country varchar (60) NOT NULL,
	city varchar (60) NOT NULL
);

CREATE TABLE public.reservations_status (
	id int primary key,
	name varchar (60) NOT NULL
);

INSERT INTO
	reservations_status(id, name)
VALUES
	(1, 'submitted');

INSERT INTO
	reservations_status(id, name)
VALUES
	(2, 'confirmed');

INSERT INTO
	reservations_status(id, name)
VALUES
	(3, 'rejected');

CREATE TABLE public.listings_category (
	id int primary key,
	name varchar (60) NOT NULL
);

INSERT INTO
	listings_category(id, name)
VALUES
	(1, 'House');

INSERT INTO
	listings_category(id, name)
VALUES
	(2, 'Apartment');

INSERT INTO
	listings_category(id, name)
VALUES
	(3, 'Room');

INSERT INTO
	listings_category(id, name)
VALUES
	(4, 'Apartments');

CREATE TABLE public.messages_status (
	id int primary key,
	name varchar (60) NOT NULL
);

INSERT INTO
	messages_status(id, name)
VALUES
	(1, 'sent');

INSERT INTO
	messages_status(id, name)
VALUES
	(2, 'received');

INSERT INTO
	messages_status(id, name)
VALUES
	(3, 'read');

INSERT INTO
	messages_status(id, name)
VALUES
	(4, 'deleted');

CREATE TABLE public.hosts (
	id int generated always as identity primary key,
	personal_code varchar (255) NOT NULL,
	bank_account varchar (40) NOT NULL,
	CONSTRAINT fk_user FOREIGN KEY(id) REFERENCES public.users (id)
);

CREATE TABLE public.listings (
	id int generated always as identity primary key,
	suspension_status boolean NOT NULL,
	photos varchar (255) NOT NULL,
	title varchar (60) NOT NULL,
	description text NOT NULL,
	city varchar (20) NOT NULL,
	address varchar (100) NOT NULL,
	country varchar (60) NOT NULL,
	creation_date timestamp NOT NULL,
	number_of_seats int NOT NULL,
	daily_price int NOT NULL,
	category int NOT NULL,
	fk_hosts int NOT NULL,
	FOREIGN KEY(category) REFERENCES public.listings_category (id),
	CONSTRAINT fk_hosts FOREIGN KEY(fk_hosts) REFERENCES public.hosts (id)
);

CREATE TABLE public.reports (
	id int generated always as identity primary key,
	title varchar (60) NOT NULL,
	creation_date timestamp NOT NULL,
	start_date date NOT NULL,
	end_date date NOT NULL,
	file_url varchar (255) NOT NULL,
	fk_listing int NOT NULL,
	fk_hosts int NOT NULL,
	CONSTRAINT fk_listings FOREIGN KEY(fk_listing) REFERENCES public.listings (id),
	CONSTRAINT fk_hosts FOREIGN KEY(fk_hosts) REFERENCES public.hosts (id)
);

CREATE TABLE public.photos (
	id int generated always as identity primary key,
	url varchar (255) NOT NULL,
	fk_listing int NOT NULL,
	CONSTRAINT fk_listings FOREIGN KEY(fk_listing) REFERENCES public.listings(id)
);

CREATE TABLE public.services (
	id int generated always as identity primary key,
	title varchar (60) NOT NULL,
	description varchar (255) NOT NULL,
	price int NOT NULL,
	fk_listing int NOT NULL,
	CONSTRAINT fk_listings FOREIGN KEY(fk_listing) REFERENCES public.listings (id)
);

CREATE TABLE public.reservations (
	id int generated always as identity primary key,
	start_date date NOT NULL,
	end_date date NOT NULL,
	total_price int NOT NULL,
	creation_date timestamp NOT NULL,
	status int NOT NULL,
	fk_listing int NOT NULL,
	fk_user int NOT NULL,
	FOREIGN KEY(status) REFERENCES public.reservations_status (id),
	CONSTRAINT fk_listings FOREIGN KEY(fk_listing) REFERENCES public.listings (id),
	CONSTRAINT fk_User FOREIGN KEY(fk_user) REFERENCES public.users (id)
);

CREATE TABLE public.payments (
	id int generated always as identity primary key,
	first_name varchar (30) NOT NULL,
	last_name varchar (30) NOT NULL,
	date timestamp NOT NULL,
	payment_method varchar (30) NOT NULL,
	payment_number varchar (30) NOT NULL,
	payer_email varchar (60) NOT NULL,
	amount int NOT NULL,
	status int NOT NULL,
	fk_reservation int NOT NULL,
	UNIQUE(fk_reservation),
	CONSTRAINT fk_reservations FOREIGN KEY(fk_reservation) REFERENCES public.reservations (id)
);

CREATE TABLE public.notifications (
	id int generated always as identity primary key,
	sent_time timestamp NOT NULL,
	title varchar (60) NOT NULL,
	text text NOT NULL,
	fk_reservation int NOT NULL,
	CONSTRAINT fk_reservations FOREIGN KEY(fk_reservation) REFERENCES public.reservations (id)
);

CREATE TABLE public.ordered_services (
	id int generated always as identity primary key,
	fk_service int NOT NULL,
	fk_reservation int NOT NULL,
	UNIQUE(fk_service),
	CONSTRAINT fk_services FOREIGN KEY(fk_service) REFERENCES public.services (id),
	CONSTRAINT fk_reservations FOREIGN KEY(fk_reservation) REFERENCES public.reservations (id)
);

CREATE TABLE public.messages (
	id int generated always as identity primary key,
	sent_time timestamp NOT NULL,
	received_time timestamp NULL,
	read_time timestamp NULL,
	text text NOT NULL,
	status int NOT NULL,
	fk_sender int NOT NULL,
	fk_reservation int NOT NULL,
	fk_receiver int NOT NULL,
	FOREIGN KEY(status) REFERENCES public.messages_status (id),
	CONSTRAINT fk_sender FOREIGN KEY(fk_sender) REFERENCES public.users (id),
	CONSTRAINT fk_reservations FOREIGN KEY(fk_reservation) REFERENCES public.reservations (id),
	CONSTRAINT fk_receiver FOREIGN KEY(fk_receiver) REFERENCES public.users (id)
);