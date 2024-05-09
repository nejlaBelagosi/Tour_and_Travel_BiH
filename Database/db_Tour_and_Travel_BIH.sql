CREATE TABLE USERS(
    UserId INT NOT NULL PRIMARY KEY,
    UserType VARCHAR(50) NOT NULL,
    UserName VARCHAR(50) NOT NULL,
    UserSurname VARCHAR(50) NOT NULL,
    UserAddress NVARCHAR(50) NOT NULL,
    DateOfBirth date,
    Contact NVARCHAR(15),
    UserEmail NVARCHAR(50) NOT NULL,
    UserPassword NVARCHAR(50) NOT NULL,
)

CREATE TABLE ACCOUNT(
    ProfileId INT PRIMARY KEY NOT NULL,
)

ALTER TABLE ACCOUNT
ADD UserId INT NOT NULL REFERENCES USERS(UserId)




CREATE TABLE DESTINATIONS(
    DestinationId INT NOT NULL PRIMARY KEY,
    DestinationLocation NVARCHAR(50) NOT NULL,
    DestinationName NVARCHAR(50) NOT NULL,
    DestinationImage IMAGE,
)

CREATE TABLE TOUR_PACKAGES(
    PackageId INT NOT NULL PRIMARY KEY,
    PackageAvailability BIT,
    StartDate DATE,
    EndDate DATE,
    Accomodation VARCHAR,
    PackageDescription NVARCHAR(300),
    Price FLOAT,
)

ALTER TABLE TOUR_PACKAGES
ADD DestinationId INT NOT NULL REFERENCES DESTINATIONS(DestinationId)

CREATE TABLE RESERVATIONS(
    ReservationId INT NOT NULL PRIMARY KEY,
    TotalTravelers INT NOT NULL,
    DateOfReservation DATE NOT NULL,
    PaymentStatus VARCHAR,
    TotalPrice FLOAT NOT NULL,
)

ALTER TABLE RESERVATIONS
ADD UserId INT NOT NULL REFERENCES USERS(UserId)

ALTER TABLE RESERVATIONS
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGES(PackageId)

ALTER TABLE RESERVATIONS
ADD ReservationStatus VARCHAR NOT NULL 

CREATE TABLE PAYMENTS(
    PaymentId INT PRIMARY KEY NOT NULL,
    PaymentMethod VARCHAR,
    TotalCost FLOAT NOT NULL,
    TransactionDate DATE NOT NULL,
    TransactionStatus BIT,

)

ALTER TABLE PAYMENTS
ADD ReservationId INT NOT NULL REFERENCES RESERVATIONS(ReservationId)

CREATE TABLE FAVORITES(
    FavoriteItemId INT NOT NULL PRIMARY KEY,
)

ALTER TABLE FAVORITES
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGES(PackageId)

ALTER TABLE FAVORITES
ADD UserId INT NOT NULL REFERENCES USERS(UserId)

CREATE TABLE REVIEWS(
    ReviewId INT NOT NULL PRIMARY KEY,
    PostDate DATE,
    ReviewComment VARCHAR(300) NOT NULL,
    Rating INT NOT NULL
)

ALTER TABLE REVIEWS
ADD UserId INT NOT NULL REFERENCES USERS(UserId)

ALTER TABLE REVIEWS
ADD ReservationId INT NOT NULL REFERENCES RESERVATIONS(ReservationId)

SELECT * FROM USERS
SELECT * FROM ACCOUNT
SELECT * FROM DESTINATIONS
SELECT * FROM TOUR_PACKAGES
SELECT * FROM RESERVATIONS
SELECT * FROM PAYMENTS
SELECT * FROM FAVORITES
SELECT * FROM REVIEWS
