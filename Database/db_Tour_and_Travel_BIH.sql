------------------- USERS -------------------------------

CREATE TABLE USERS(
    UserId INT NOT NULL PRIMARY KEY,
    UserType VARCHAR(50) NOT NULL,
    UserName VARCHAR(50) NOT NULL,
    UserSurname VARCHAR(50) NOT NULL,
    UserAddress NVARCHAR(50) NOT NULL,
    DateOfBirth date,
    Contact NVARCHAR(15),
    UserEmail NVARCHAR(50) NOT NULL,
)

---edited attribute name ---------------

EXEC  sp_rename "USERS.UserName", "Name", "COLUMN"
EXEC  sp_rename "USERS.UserSurname", "Surname", "COLUMN"
EXEC sp_rename "USERS.UserEmail", "Email", "COLUMN"

------------------ ACCOUNT AND ACCOUNT TYPES ----------------------------------

CREATE TABLE ACCOUNT(
    ProfileId INT PRIMARY KEY NOT NULL,
)

--- ProfileId changed into AccountId

--Added new attributes

ALTER TABLE ACCOUNT
ADD Username NVARCHAR(50)

ALTER TABLE ACCOUNT
ADD UserPassword NVARCHAR(50)

ALTER TABLE ACCOUNT
ADD UserId INT NOT NULL REFERENCES USERS(UserId)

ALTER TABLE ACCOUNT
ADD AccountTypeId INT NOT NULL REFERENCES ACCOUNT_TYPES(AccountTypeId)

--------------- ACOUNT_TYPES ----------------------------------------------

CREATE TABLE ACCOUNT_TYPES(
    AccountTypeId INT NOT NULL PRIMARY KEY,
    UserType VARCHAR
)

----------- DESTINATIONS --------------------------

CREATE TABLE DESTINATIONS(
    DestinationId INT NOT NULL PRIMARY KEY,
    DestinationLocation NVARCHAR(50) NOT NULL,
    DestinationName NVARCHAR(50) NOT NULL,
    DestinationImage IMAGE,
)
---------- TOUR_PACKAGES -------------------------

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

ALTER TABLE TOUR_PACKAGES
ALTER COLUMN Price MONEY

-------------------- RESERVATIONS -------------------------------------------------

CREATE TABLE RESERVATIONS(
    ReservationId INT NOT NULL PRIMARY KEY,
    TotalTravelers INT NOT NULL,
    DateOfReservation DATE NOT NULL,
    PaymentStatus VARCHAR,
    TotalPrice FLOAT NOT NULL,
)

ALTER TABLE RESERVATIONS
ALTER COLUMN TotalPrice MONEY

ALTER TABLE RESERVATIONS
ADD UserId INT NOT NULL REFERENCES USERS(UserId)

ALTER TABLE RESERVATIONS
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGES(PackageId)

ALTER TABLE RESERVATIONS
ADD ReservationStatus VARCHAR NOT NULL 

------------------- PAYMENTS ---------------------------------------

CREATE TABLE PAYMENTS(
    PaymentId INT PRIMARY KEY NOT NULL,
    PaymentMethod VARCHAR,
    TotalCost FLOAT NOT NULL,
    TransactionDate DATE NOT NULL,
    TransactionStatus BIT,

)

ALTER TABLE PAYMENTS
ALTER COLUMN TotalCost MONEY

ALTER TABLE PAYMENTS
ADD ReservationId INT NOT NULL REFERENCES RESERVATIONS(ReservationId)

------------------- FAVORITES --------------------------------------------

CREATE TABLE FAVORITES(
    FavoriteItemId INT NOT NULL PRIMARY KEY,
)

ALTER TABLE FAVORITES
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGES(PackageId)

ALTER TABLE FAVORITES
ADD UserId INT NOT NULL REFERENCES USERS(UserId)

---------------------- REVIEWS -----------------------------------------
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
