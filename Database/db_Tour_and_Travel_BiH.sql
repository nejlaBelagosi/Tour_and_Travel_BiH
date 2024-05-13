------------------- USERS -------------------------------

CREATE TABLE [USER](
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

EXEC  sp_rename "[USER].UserName", "Name", "COLUMN"
EXEC  sp_rename "[USER].UserSurname", "Surname", "COLUMN"
EXEC sp_rename "[USER].UserEmail", "Email", "COLUMN"
EXEC sp_rename "[USER].UserAddress", "Address", "COLUMN"

--delete column
ALTER TABLE [USER]
DROP COLUMN UserType

------------------ ACCOUNT AND ACCOUNT TYPES ----------------------------------

CREATE TABLE ACCOUNT(
    ProfileId INT PRIMARY KEY NOT NULL,
)
EXEC sp_rename "ACCOUNT.ProfileId", "AccountId", "COLUMN"
--- ProfileId changed into AccountId

--Added new attributes

ALTER TABLE ACCOUNT
ADD Username NVARCHAR(50)

ALTER TABLE ACCOUNT
ADD UserPassword NVARCHAR(50)

ALTER TABLE ACCOUNT
ADD userImage NVARCHAR(50)

ALTER TABLE ACCOUNT
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

ALTER TABLE ACCOUNT
ADD AccountTypeId INT NOT NULL REFERENCES ACCOUNT_TYPE(AccountTypeId)

--------------- ACOUNT_TYPES ----------------------------------------------

CREATE TABLE ACCOUNT_TYPE(
    AccountTypeId INT NOT NULL PRIMARY KEY,
    UserType VARCHAR
)

----------- DESTINATIONS --------------------------

CREATE TABLE DESTINATION(
    DestinationId INT NOT NULL PRIMARY KEY,
    DestinationLocation NVARCHAR(50) NOT NULL,
    DestinationName NVARCHAR(50) NOT NULL,
    DestinationImage IMAGE,
)

ALTER TABLE DESTINATION
ALTER COLUMN DestinationImage NVARCHAR(50)

---------- TOUR_PACKAGES -------------------------

CREATE TABLE TOUR_PACKAGE(
    PackageId INT NOT NULL PRIMARY KEY,
    PackageAvailability BIT,
    StartDate DATE,
    EndDate DATE,
    Accomodation VARCHAR,
    PackageDescription NVARCHAR(300),
    Price FLOAT,
)

ALTER TABLE TOUR_PACKAGE
ADD DestinationId INT NOT NULL REFERENCES DESTINATION(DestinationId)

ALTER TABLE TOUR_PACKAGE
ALTER COLUMN Price MONEY

-------------------- RESERVATIONS -------------------------------------------------

CREATE TABLE RESERVATION(
    ReservationId INT NOT NULL PRIMARY KEY,
    TotalTravelers INT NOT NULL,
    DateOfReservation DATE NOT NULL,
    PaymentStatus VARCHAR,
    TotalPrice FLOAT NOT NULL,
)

ALTER TABLE RESERVATION
ALTER COLUMN TotalPrice MONEY

ALTER TABLE RESERVATION
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

ALTER TABLE RESERVATION
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGE(PackageId)

ALTER TABLE RESERVATION
ADD ReservationStatus VARCHAR NOT NULL 

------------------- PAYMENTS ---------------------------------------

CREATE TABLE PAYMENT(
    PaymentId INT PRIMARY KEY NOT NULL,
    PaymentMethod VARCHAR,
    TotalCost FLOAT NOT NULL,
    TransactionDate DATE NOT NULL,
    TransactionStatus BIT,

)

ALTER TABLE PAYMENT
ALTER COLUMN TotalCost MONEY

ALTER TABLE PAYMENT
ADD ReservationId INT NOT NULL REFERENCES RESERVATION(ReservationId)

------------------- FAVORITES --------------------------------------------

CREATE TABLE FAVORITE(
    FavoriteItemId INT NOT NULL PRIMARY KEY,
)

ALTER TABLE FAVORITE
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGE(PackageId)

ALTER TABLE FAVORITE
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

---------------------- REVIEWS -----------------------------------------
CREATE TABLE REVIEW(
    ReviewId INT NOT NULL PRIMARY KEY,
    PostDate DATE,
    ReviewComment VARCHAR(300) NOT NULL,
    Rating INT NOT NULL
)

ALTER TABLE REVIEW
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

ALTER TABLE REVIEW
ADD ReservationId INT NOT NULL REFERENCES RESERVATION(ReservationId)

---------INSERTS----------
INSERT INTO [USER](UserId,Name,Surname,Address,DateOfBirth,Contact,Email)
VALUES(0,'Nejla','Belagosi','Semira Fraste','2001-7-11','38762166353','belagosinejla@hotmail.com')

SELECT * FROM [USER]
SELECT * FROM ACCOUNT
SELECT * FROM DESTINATION
SELECT * FROM TOUR_PACKAGE
SELECT * FROM RESERVATION
SELECT * FROM PAYMENT
SELECT * FROM FAVORITE
SELECT * FROM REVIEW
