DROP DATABASE IF EXISTS FinanceDB;
CREATE DATABASE FinanceDB;
USE FinanceDB;

CREATE TABLE account_book (
	book_id int NOT NULL AUTO_INCREMENT,
	book_name varchar(225) NOT NULL,
    book_password varchar(225) NOT NULL,
    email varchar(225) NOT NULL,
    PRIMARY KEY (book_id)
);

CREATE TABLE catagory_type_ENUM (
	catagory_type_ENUM_id int NOT NULL AUTO_INCREMENT,
	catagory_type varchar(225) NOT NULL,
    PRIMARY KEY (catagory_type_ENUM_id)
);

INSERT INTO catagory_type_ENUM (catagory_type) VALUES
('Income'),
('Expence'),
('Investment'),
('Loans');

CREATE TABLE catagory (
	catagory_id int NOT NULL AUTO_INCREMENT,
    book_id int NOT NULL,
    catagory_type_ENUM_id int NOT NULL,
    catagory_name varchar(225) NOT NULL,
    PRIMARY KEY (catagory_id),
    FOREIGN KEY (book_id) REFERENCES account_book(book_id),
    FOREIGN KEY (catagory_type_ENUM_id) REFERENCES catagory_type_ENUM(catagory_type_ENUM_id)
);

CREATE TABLE record (
	record_id int NOT NULL AUTO_INCREMENT,
    catagory_id int NOT NULL,
    book_id int NOT NULL,
    amount double,
    note varchar(225),
    dateOf dateTime,
	PRIMARY KEY (record_id),
    FOREIGN KEY (catagory_id) REFERENCES catagory(catagory_id),
    FOREIGN KEY (book_id) REFERENCES account_book(book_id)
);