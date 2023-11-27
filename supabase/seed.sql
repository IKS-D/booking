--@(#) script.ddl
CREATE TABLE public.profiles (
	id uuid not null references auth.users on delete cascade,
	first_name varchar (30) NOT NULL,
	last_name varchar (30) NOT NULL,
	birth_date date NOT NULL,
	phone varchar (20) NOT NULL,
	photos varchar (255) NOT NULL,
	country varchar (60) NOT NULL,
	city varchar (60) NOT NULL,
	UNIQUE(id)
);

CREATE TABLE public.reservation_status (
	id int primary key,
	name varchar (60) NOT NULL
);

INSERT INTO
	reservation_status(id, name)
VALUES
	(1, 'pending');

INSERT INTO
	reservation_status(id, name)
VALUES
	(2, 'confirmed');

INSERT INTO
	reservation_status(id, name)
VALUES
	(3, 'rejected');

INSERT INTO
	reservation_status(id, name)
VALUES
	(4, 'cancelled');

CREATE TABLE public.listing_category (
	id int primary key,
	name varchar (60) NOT NULL
);

INSERT INTO
	listing_category(id, name)
VALUES
	(1, 'House');

INSERT INTO
	listing_category(id, name)
VALUES
	(2, 'Apartment');

INSERT INTO
	listing_category(id, name)
VALUES
	(3, 'Room');

INSERT INTO
	listing_category(id, name)
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
	id uuid not null references auth.users on delete cascade,
	personal_code varchar (255) NOT NULL,
	bank_account varchar (40) NOT NULL,
	UNIQUE(id)
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
	number_of_places int NOT NULL,
	day_price int NOT NULL,
	category_id int NOT NULL,
	host_id uuid NOT NULL,
	FOREIGN KEY(category_id) REFERENCES public.listing_category (id),
	FOREIGN KEY(host_id) REFERENCES public.hosts (id)
);

CREATE TABLE public.reports (
	id int generated always as identity primary key,
	title varchar (60) NOT NULL,
	creation_date timestamp NOT NULL,
	start_date date NOT NULL,
	end_date date NOT NULL,
	file_url varchar (255) NOT NULL,
	listing_id int NOT NULL,
	host_id uuid NOT NULL,
	FOREIGN KEY(listing_id) REFERENCES public.listings (id),
	FOREIGN KEY(host_id) REFERENCES public.hosts (id)
);

CREATE TABLE public.photos (
	id int generated always as identity primary key,
	url varchar (255) NOT NULL,
	listing_id int NOT NULL,
	FOREIGN KEY(listing_id) REFERENCES public.listings(id)
);

CREATE TABLE public.services (
	id int generated always as identity primary key,
	title varchar (60) NOT NULL,
	description varchar (255) NOT NULL,
	price int NOT NULL,
	listing_id int NOT NULL,
	FOREIGN KEY(listing_id) REFERENCES public.listings (id)
);

CREATE TABLE public.reservations (
	id int generated always as identity primary key,
	start_date date NOT NULL,
	end_date date NOT NULL,
	total_price int NOT NULL,
	creation_date timestamp NOT NULL,
	status int NOT NULL,
	listing_id int NOT NULL,
	user_id uuid NOT NULL,
	FOREIGN KEY(status) REFERENCES public.reservation_status (id),
	FOREIGN KEY(listing_id) REFERENCES public.listings (id),
	FOREIGN KEY(user_id) REFERENCES public.profiles (id)
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
	reservation_id int NOT NULL,
	UNIQUE(reservation_id),
	FOREIGN KEY(reservation_id) REFERENCES public.reservations (id)
);

CREATE TABLE public.notifications (
	id int generated always as identity primary key,
	sent_time timestamp NOT NULL,
	title varchar (60) NOT NULL,
	text text NOT NULL,
	reservation_id int NOT NULL,
	FOREIGN KEY(reservation_id) REFERENCES public.reservations (id)
);

CREATE TABLE public.ordered_services (
	id int generated always as identity primary key,
	service_id int NOT NULL,
	reservation_id int NOT NULL,
	FOREIGN KEY(service_id) REFERENCES public.services (id),
	FOREIGN KEY(reservation_id) REFERENCES public.reservations (id)
);

CREATE TABLE public.messages (
	id int generated always as identity primary key,
	sent_time timestamp NOT NULL,
	received_time timestamp NULL,
	read_time timestamp NULL,
	text text NOT NULL,
	status int NOT NULL,
	sender_id uuid NOT NULL,
	received_id uuid NOT NULL,
	reservation_id int NOT NULL,
	FOREIGN KEY(status) REFERENCES public.messages_status (id),
	FOREIGN KEY(sender_id) REFERENCES auth.users (id),
	FOREIGN KEY(received_id) REFERENCES auth.users (id),
	FOREIGN KEY(reservation_id) REFERENCES public.reservations (id)
);