--@(#) script.ddl

CREATE TABLE public.User
(
	id int NOT NULL,
	email varchar (255) NOT NULL,
	password varchar (255) NOT NULL,
	first_name varchar (30) NOT NULL,
	last_name varchar (30) NOT NULL,
	birth_date date NOT NULL,
	phone varchar (20) NOT NULL,
	photo varchar (255) NOT NULL,
	registration_date timestamp NOT NULL,
	update_date timestamp NOT NULL,
	country varchar (60) NOT NULL,
	city varchar (60) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE public.reservation_status
(
	id int NOT NULL,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO reservation_status(id, name) VALUES(1, 'submitted');
INSERT INTO reservation_status(id, name) VALUES(2, 'confirmed');
INSERT INTO reservation_status(id, name) VALUES(3, 'rejected');

CREATE TABLE public.listing_category
(
	id int,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO listing_category(id, name) VALUES(1, 'House');
INSERT INTO listing_category(id, name) VALUES(2, 'Apartment');
INSERT INTO listing_category(id, name) VALUES(3, 'Room');
INSERT INTO listing_category(id, name) VALUES(4, 'Apartments');

CREATE TABLE public.message_status
(
	id int NOT NULL,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO message_status(id, name) VALUES(1, 'sent');
INSERT INTO message_status(id, name) VALUES(2, 'received');
INSERT INTO message_status(id, name) VALUES(3, 'read');
INSERT INTO message_status(id, name) VALUES(4, 'deleted');

CREATE TABLE public.Manager
(
	id int NOT NULL,
	personal_code varchar (255) NOT NULL,
	bank_account varchar (40) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_User FOREIGN KEY(id) REFERENCES public.User (id)
);

CREATE TABLE public.listing
(
	suspension_status boolean NOT NULL,
	photos varchar (255) NOT NULL,
	id int NOT NULL,
	title varchar (60) NOT NULL,
	description text NOT NULL,
	city varchar (20) NOT NULL,
	address varchar (100) NOT NULL,
	country varchar (60) NOT NULL,
	creation_date timestamp NOT NULL,
	number_of_seats int NOT NULL,
	daily_price money NOT NULL,
	category int NOT NULL,
	fk_Manager int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(category) REFERENCES public.listing_category (id),
	CONSTRAINT fk_Manager FOREIGN KEY(fk_Manager) REFERENCES public.Manager (id)
);

CREATE TABLE public.Report
(
	id int NOT NULL,
	title varchar (60) NOT NULL,
	creation_date timestamp NOT NULL,
	start_date date NOT NULL,
	end_date date NOT NULL,
	file_url varchar (255) NOT NULL,
	fk_listing
 int NOT NULL,
	fk_Manager int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_listing
 FOREIGN KEY(fk_listing
) REFERENCES public.listing
 (id),
	CONSTRAINT fk_Manager FOREIGN KEY(fk_Manager) REFERENCES public.Manager (id)
);

CREATE TABLE public.Photo
(
	id int NOT NULL,
	url varchar (255) NOT NULL,
	fk_listing
 int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_listing
 FOREIGN KEY(fk_listing
) REFERENCES public.listing
 (id)
);

CREATE TABLE public.Service
(
	id int NOT NULL,
	title varchar (60) NOT NULL,
	description varchar (255) NOT NULL,
	price money NOT NULL,
	fk_listing
 int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_listing
 FOREIGN KEY(fk_listing
) REFERENCES public.listing
 (id)
);

CREATE TABLE public.Reservation
(
	id int NOT NULL,
	start_date date NOT NULL,
	end_date date NOT NULL,
	total_price money NOT NULL,
	creation_date timestamp NOT NULL,
	status int NOT NULL,
	fk_listing
 int NOT NULL,
	fk_User int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(status) REFERENCES public.reservation_status (id),
	CONSTRAINT fk_listing
 FOREIGN KEY(fk_listing
) REFERENCES public.listing
 (id),
	CONSTRAINT fk_User FOREIGN KEY(fk_User) REFERENCES public.User (id)
);

CREATE TABLE public.Payment
(
	id int NOT NULL,
	first_name varchar (30) NOT NULL,
	last_name varchar (30) NOT NULL,
	date timestamp NOT NULL,
	payment_method varchar (30) NOT NULL,
	payment_number varchar (30) NOT NULL,
	payer_email varchar (60) NOT NULL,
	amount money NOT NULL,
	status int NOT NULL,
	fk_Reservation int NOT NULL,
	PRIMARY KEY(id),
	UNIQUE(fk_Reservation),
	CONSTRAINT fk_Reservation FOREIGN KEY(fk_Reservation) REFERENCES public.Reservation (id)
);

CREATE TABLE public.Notification
(
	id int NOT NULL,
	sent_time timestamp NOT NULL,
	title varchar (60) NOT NULL,
	text text NOT NULL,
	fk_Reservation int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_Reservation FOREIGN KEY(fk_Reservation) REFERENCES public.Reservation (id)
);

CREATE TABLE public.Ordered_service
(
	id int NOT NULL,
	fk_Service int NOT NULL,
	fk_Reservation int NOT NULL,
	PRIMARY KEY(id),
	UNIQUE(fk_Service),
	CONSTRAINT fk_Service FOREIGN KEY(fk_Service) REFERENCES public.Service (id),
	CONSTRAINT fk_Reservation FOREIGN KEY(fk_Reservation) REFERENCES public.Reservation (id)
);

CREATE TABLE public.Message
(
	id int NOT NULL,
	sent_time timestamp NOT NULL,
	received_time timestamp NULL,
	read_time timestamp NULL,
	text text NOT NULL,
	status int NOT NULL,
	fk_sender int NOT NULL,
	fk_Reservation int NOT NULL,
	fk_receiver int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(status) REFERENCES public.message_status (id),
	CONSTRAINT fk_sender FOREIGN KEY(fk_sender) REFERENCES public.User (id),
	CONSTRAINT fk_Reservation FOREIGN KEY(fk_Reservation) REFERENCES public.Reservation (id),
	CONSTRAINT fk_receiver FOREIGN KEY(fk_receiver) REFERENCES public.User (id)
);
