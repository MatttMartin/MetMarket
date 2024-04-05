CREATE TABLE public.users (
	id INT8 NOT NULL DEFAULT unique_rowid(),
	is_admin INT2 NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone_number VARCHAR(20) NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX users_email_key (email ASC),
	UNIQUE INDEX users_phone_number_key (phone_number ASC),
	CONSTRAINT check_is_admin CHECK (is_admin IN (0:::INT8, 1:::INT8))
);
CREATE TABLE public.products (
	product_id INT8 NOT NULL DEFAULT unique_rowid(),
	user_id INT8 NULL,
	location_id INT8 NOT NULL,
	title VARCHAR(200) NOT NULL,
	description VARCHAR(1000) NULL,
	price DECIMAL(10,2) NOT NULL,
	is_available INT8 NULL,
	category_id INT8 NULL,
	subcategory_id INT8 NULL,
	date_posted DATE NOT NULL,
	meet_on_campus INT8 NULL DEFAULT 0:::INT8,
	CONSTRAINT products_pkey PRIMARY KEY (product_id ASC),
	CONSTRAINT check_is_available CHECK (is_available IN (0:::INT8, 1:::INT8)),
	CONSTRAINT check_is_available1 CHECK (is_available IN (0:::INT8, 1:::INT8))
);
CREATE TABLE public.conversations (
	conversation_id INT8 NOT NULL DEFAULT unique_rowid(),
	product_id INT8 NULL,
	userid1 INT8 NULL,
	userid2 INT8 NULL,
	CONSTRAINT conversations_pkey PRIMARY KEY (conversation_id ASC)
);
CREATE TABLE public.messages (
	message_id INT8 NOT NULL DEFAULT unique_rowid(),
	sender_id INT8 NULL,
	receiver_id INT8 NULL,
	message STRING NULL,
	time_stamp TIMESTAMPTZ NOT NULL,
	conversation_id INT8 NOT NULL,
	CONSTRAINT messages_pkey PRIMARY KEY (message_id ASC)
);
CREATE TABLE public.images (
	id INT8 NOT NULL DEFAULT unique_rowid(),
	product_id INT8 NOT NULL,
	image_link VARCHAR(255) NOT NULL,
	image_title VARCHAR(100) NULL,
	CONSTRAINT images_pkey PRIMARY KEY (id ASC)
);
CREATE TABLE public.categories (
	category_id INT8 NOT NULL,
	category_name VARCHAR(50) NOT NULL,
	CONSTRAINT categories_pkey PRIMARY KEY (category_id ASC)
);
CREATE TABLE public.subcategories (
	subcategory_id INT8 NOT NULL DEFAULT unique_rowid(),
	category_id INT8 NULL,
	subcategory_name VARCHAR(255) NOT NULL,
	CONSTRAINT subcategories_pkey PRIMARY KEY (subcategory_id ASC)
);
CREATE TABLE public.reported_ads (
	id INT8 NOT NULL DEFAULT unique_rowid(),
	ad_id INT8 NULL,
	reason STRING NULL,
	reported_on TIMESTAMP NULL DEFAULT now():::TIMESTAMP,
	CONSTRAINT reported_ads_pkey PRIMARY KEY (id ASC)
);
CREATE TABLE public.passwords (
	user_id INT8 NOT NULL,
	hashed_password STRING NOT NULL,
	CONSTRAINT passwords_pkey PRIMARY KEY (user_id ASC)
);
CREATE TABLE public.provinces (
	province_id INT8 NOT NULL DEFAULT unique_rowid(),
	province_name STRING NOT NULL,
	CONSTRAINT provinces_pkey PRIMARY KEY (province_id ASC)
);
CREATE TABLE public.locations (
	location_id INT8 NOT NULL DEFAULT unique_rowid(),
	city STRING NOT NULL,
	province_id INT8 NOT NULL,
	CONSTRAINT locations_pkey PRIMARY KEY (location_id ASC)
);
CREATE TABLE public.profile_pictures (
	user_id INT8 NOT NULL,
	link STRING NOT NULL,
	rowid INT8 NOT VISIBLE NOT NULL DEFAULT unique_rowid(),
	CONSTRAINT profile_pictures_pkey PRIMARY KEY (rowid ASC)
);	
CREATE TABLE public.reported_users (
	id INT8 NOT NULL DEFAULT unique_rowid(),
	reported_user_id INT8 NULL,
	reported_by_user_id INT8 NULL,
	reason STRING NULL,
	reported_on TIMESTAMP NULL DEFAULT now():::TIMESTAMP,
	first_name STRING NULL,
	last_name STRING NULL,
	CONSTRAINT reported_users_pkey PRIMARY KEY (id ASC)
);
ALTER TABLE public.products ADD CONSTRAINT new_foreign_key_constraint_products_users FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.conversations ADD CONSTRAINT conversations_userid1_fkey FOREIGN KEY (userid1) REFERENCES public.users(id);

ALTER TABLE public.conversations ADD CONSTRAINT conversations_userid2_fkey FOREIGN KEY (userid2) REFERENCES public.users(id);

ALTER TABLE public.conversations ADD CONSTRAINT new_foreign_key_constraint_name FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;

ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);

ALTER TABLE public.messages ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id);

ALTER TABLE public.messages ADD CONSTRAINT new_foreign_key_constraint_messages FOREIGN KEY (conversation_id) REFERENCES public.conversations(conversation_id) ON DELETE CASCADE;

ALTER TABLE public.images ADD CONSTRAINT new_foreign_key_constraint_images FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;

ALTER TABLE public.subcategories ADD CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);

ALTER TABLE public.reported_ads ADD CONSTRAINT new_foreign_key_constraint_reported_ads FOREIGN KEY (ad_id) REFERENCES public.products(product_id) ON DELETE CASCADE;

ALTER TABLE public.passwords ADD CONSTRAINT passwords_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
	
ALTER TABLE public.locations ADD CONSTRAINT province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id);
	
ALTER TABLE public.profile_pictures ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
	
ALTER TABLE public.reported_users ADD CONSTRAINT fkc_reported_users_reported_user_id FOREIGN KEY (reported_user_id) REFERENCES public.users(id) ON DELETE CASCADE;
	
ALTER TABLE public.reported_users ADD CONSTRAINT fkc_reported_users_reported_by_user_id FOREIGN KEY (reported_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;

