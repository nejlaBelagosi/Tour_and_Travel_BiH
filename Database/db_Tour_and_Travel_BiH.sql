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

ALTER TABLE [USER]
ALTER COLUMN DateOfBirth DATE

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
ADD userImage NVARCHAR(MAX)

ALTER TABLE ACCOUNT
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

ALTER TABLE ACCOUNT
ADD AccountTypeId INT NOT NULL REFERENCES ACCOUNT_TYPE(AccountTypeId)

ALTER TABLE ACCOUNT
ALTER COLUMN userImage NVARCHAR(MAX)

ALTER TABLE ACCOUNT
DROP CONSTRAINT FK__ACCOUNT__UserId__208CD6FA;

ALTER TABLE ACCOUNT
ADD CONSTRAINT FK__ACCOUNT__UserId__208CD6FA
FOREIGN KEY (UserId) REFERENCES [USER](UserId)
ON DELETE CASCADE;


--------------- ACOUNT_TYPES ----------------------------------------------

CREATE TABLE ACCOUNT_TYPE(
    AccountTypeId INT NOT NULL PRIMARY KEY,
    UserType VARCHAR
)

ALTER TABLE ACCOUNT_TYPE
ALTER COLUMN UserType VARCHAR(200)

----------- DESTINATIONS --------------------------

CREATE TABLE DESTINATION(
    DestinationId INT NOT NULL PRIMARY KEY,
    DestinationLocation NVARCHAR(50) NOT NULL,
    DestinationName NVARCHAR(50) NOT NULL,
    DestinationImage IMAGE,
)

ALTER TABLE DESTINATION
ALTER COLUMN DestinationImage NVARCHAR(MAX)

ALTER TABLE DESTINATION
ADD DestinatioDetails VARCHAR

ALTER TABLE DESTINATION
ALTER COLUMN DestinationDetails VARCHAR(MAX)

EXEC sp_rename "DESTINATION.DestinatioDetails", 'DestinationDetails','COLUMN'

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
ALTER COLUMN Accomodation VARCHAR(200)

ALTER TABLE TOUR_PACKAGE
ALTER COLUMN PackageDescription VARCHAR(MAX)

ALTER TABLE TOUR_PACKAGE
ADD TourHighlights VARCHAR(MAX)

ALTER TABLE TOUR_PACKAGE
ADD AdditionalInformations VARCHAR(MAX)

ALTER TABLE TOUR_PACKAGE
ADD DestinationId INT NOT NULL REFERENCES DESTINATION(DestinationId)

ALTER TABLE TOUR_PACKAGE
ALTER COLUMN Price MONEY

SELECT * FROM TOUR_PACKAGE
CREATE TABLE TOUR_PACKAGE_DATE(
    DateId INT NOT NULL PRIMARY KEY IDENTITY,
    PackageId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    FOREIGN KEY (PackageId) REFERENCES TOUR_PACKAGE(PackageId)
);

ALTER TABLE TOUR_PACKAGE
DROP COLUMN StartDate;

ALTER TABLE TOUR_PACKAGE
DROP COLUMN EndDate;



-------------------- RESERVATIONS -------------------------------------------------

CREATE TABLE RESERVATION(
    ReservationId INT NOT NULL PRIMARY KEY,
    TotalTravelers INT NOT NULL,
    DateOfReservation DATE NOT NULL,
    PaymentStatus VARCHAR,
    TotalPrice FLOAT NOT NULL,
)

ALTER TABLE RESERVATION
DROP COLUMN PaymentStatus

ALTER TABLE RESERVATION
ALTER COLUMN TotalPrice MONEY

ALTER TABLE RESERVATION
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

ALTER TABLE RESERVATION
ADD PackageId INT NOT NULL REFERENCES TOUR_PACKAGE(PackageId)

ALTER TABLE RESERVATION
ADD ReservationStatus VARCHAR NOT NULL 

ALTER TABLE RESERVATION
ALTER COLUMN ReservationStatus VARCHAR(200)

ALTER TABLE RESERVATION
ADD DateId INT NULL;

SELECT * FROM TOUR_PACKAGE_DATE;

UPDATE RESERVATION
SET DateId = (
    SELECT TOP 1 DateId
    FROM TOUR_PACKAGE_DATE
    WHERE TOUR_PACKAGE_DATE.PackageId = RESERVATION.PackageId
    ORDER BY StartDate
);

ALTER TABLE RESERVATION
ALTER COLUMN DateId INT NOT NULL;

ALTER TABLE RESERVATION
ADD CONSTRAINT FK_Reservation_TourPackageDate FOREIGN KEY (DateId)
REFERENCES TOUR_PACKAGE_DATE(DateId);

SELECT * FROM RESERVATION
------------------- PAYMENTS ---------------------------------------

CREATE TABLE PAYMENT(
    PaymentId INT PRIMARY KEY NOT NULL,
    PaymentMethod VARCHAR,
    TotalCost FLOAT NOT NULL,
    TransactionDate DATE NOT NULL,
    TransactionStatus BIT,
)
ALTER TABLE PAYMENT
ADD PaymentStatus VARCHAR(200)

ALTER TABLE PAYMENT
ALTER COLUMN PaymentMethod VARCHAR(200)

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
ALTER COLUMN Rating INT

ALTER TABLE REVIEW
ADD UserId INT NOT NULL REFERENCES [USER](UserId)

ALTER TABLE REVIEW
ADD ReservationId INT NOT NULL REFERENCES RESERVATION(ReservationId)

ALTER TABLE dbo.REVIEW
DROP CONSTRAINT FK__REVIEW__Reservat__14270015;

ALTER TABLE dbo.REVIEW
ADD CONSTRAINT FK__REVIEW__Reservat__14270015
FOREIGN KEY (ReservationId) 
REFERENCES dbo.RESERVATION (ReservationId) 
ON DELETE CASCADE;




------- AUTHENTICATION---------------
CREATE TABLE AUTHENTICATION_TOKEN(
    AuthenticationId INT PRIMARY KEY NOT NULL,
    AuthenticationValue NVARCHAR(50),
    RecordingTime DATETIME,
    Username NVARCHAR(50)
)

EXEC sp_rename "AUTHENTICATION_TOKEN.AuthenticationValue", "TokenValue", "COLUMN"

ALTER TABLE AUTHENTICATION_TOKEN
ADD AccountId INT REFERENCES ACCOUNT(AccountId)

ALTER TABLE AUTHENTICATION_TOKEN
DROP COLUMN Username

ALTER TABLE AUTHENTICATION_TOKEN
ADD Username NVARCHAR(50)
--Veza izmedju username iz account tabele i authentication

UPDATE AUTHENTICATION_TOKEN
SET Username = acc.Username
FROM AUTHENTICATION_TOKEN auth
JOIN ACCOUNT acc ON auth.AccountId = acc.AccountId;

--- SESSION ---
CREATE TABLE [Session](
    Id INT PRIMARY KEY,
    StartTime DATETIME,
    EndTime DATETIME,
    PageViews INT,
    Engagements INT

)

ALTER TABLE [Session]
ADD UserId INT REFERENCES [USER](UserId)

SELECT * FROM [Session]

---------INSERTS----------

---- USER-----
INSERT INTO [USER](UserId,Name,Surname,Address,DateOfBirth,Contact,Email)
VALUES
(0,'Nejla','Belagosi','Semira Fraste','2001-7-11','38762166353','belagosinejla@hotmail.com')
INSERT INTO [USER](UserId,Name,Surname,Address,DateOfBirth,Contact,Email)
VALUES
(1,'Faris','N','Dzemala Bijedica','2000-1-11','387654376','farisn12@gmail.com')

---- account_type---------------
INSERT INTO ACCOUNT_TYPE(AccountTypeId,UserType)
VALUES
(0,'admin')
INSERT INTO ACCOUNT_TYPE(AccountTypeId,UserType)
VALUES
(1,'customer')

-------ACCOUNT--------------
INSERT INTO ACCOUNT(AccountId,Username,UserPassword,userImage,UserId,AccountTypeId)
VALUES
(0,'nejlabe3','Wanderlust$56','nejla.jpg',0,0),(1,'user123','#UseR124%','user.jpg',1,1)

---------DESTINATION------------
INSERT INTO DESTINATION(DestinationId,DestinationLocation,DestinationName,DestinationImage,DestinationDetails)
VALUES(1,'Sarajevo','Trebevic','TREBEVIC.png','Osim sto nudi najljepsi pogled na Sarajevo, Trebevic je bogat historijskim znamenitostima, lokalima i modernim objektima za odmor i zabavu.')

-------TOUR_PACKAGE------------------------
INSERT INTO TOUR_PACKAGE(PackageId,PackageAvailability,StartDate,EndDate,Accomodation,PackageDescription,Price,DestinationId)
VALUES(1,1,'2024-6-11','2024-6-11','','Package include table car ride.',20,1)

---- FAVPRITE ------
INSERT INTO FAVORITE(FavoriteItemId,PackageId,UserId)
VALUES(0,1,1)

---RESERVATION-----
INSERT INTO RESERVATION(ReservationId,TotalTravelers,DateOfReservation,TotalPrice,UserId,PackageId,ReservationStatus)
VALUES(0,4,'2024-05-14',20,1,1,'rezervisano')

---PAYMENT----
INSERT INTO PAYMENT(PaymentId,PaymentMethod,TotalCost,TransactionDate,TransactionStatus,ReservationId,PaymentStatus)
VALUES(0,'online',80,'2024-05-14',1,0,'uplaceno')

----review---
INSERT INTO REVIEW(ReviewId,PostDate,ReviewComment,Rating,UserId,ReservationId)
VALUES(0,'2024-05-14','Odlicna organizacija. Preporucujem.',5,1,0)

UPDATE [USER]
SET DateOfBirth = '2000-01-01'
WHERE TRY_CONVERT(DATETIME, DateOfBirth) IS NULL;

ALTER TABLE dbo.RESERVATION
DROP CONSTRAINT FK__RESERVATI__Packa__160F4887;

ALTER TABLE dbo.RESERVATION
ADD CONSTRAINT FK__RESERVATI__Packa__160F4887
FOREIGN KEY (PackageId)
REFERENCES dbo.TOUR_PACKAGE(PackageId)
ON DELETE CASCADE;

ALTER TABLE dbo.PAYMENT
DROP CONSTRAINT FK__PAYMENT__Reserva__245D67DE;

ALTER TABLE dbo.PAYMENT
ADD CONSTRAINT FK__PAYMENT__Reserva__245D67DE
FOREIGN KEY (ReservationId)
REFERENCES dbo.RESERVATION(ReservationId)
ON DELETE CASCADE;

ALTER TABLE dbo.FAVORITE 
DROP CONSTRAINT FK__FAVORITE__Packag__19DFD96B;

ALTER TABLE dbo.FAVORITE
ADD CONSTRAINT FK__FAVORITE__Packag__19DFD96B
FOREIGN KEY (PackageId)
REFERENCES dbo.TOUR_PACKAGE(PackageId)
ON DELETE CASCADE;


SELECT * FROM [USER]
SELECT * FROM ACCOUNT
SELECT * FROM ACCOUNT_TYPE
SELECT * FROM DESTINATION
SELECT * FROM TOUR_PACKAGE
SELECT * FROM TOUR_PACKAGE_DATE
SELECT * FROM RESERVATION
SELECT * FROM PAYMENT
SELECT * FROM FAVORITE
SELECT * FROM REVIEW WHERE UserId =13
SELECT * FROM AUTHENTICATION_TOKEN

DBCC CHECKIDENT ('dbo.TOUR_PACKAGE', NORESEED);

DELETE FROM dbo.TOUR_PACKAGE;
DBCC CHECKIDENT ('dbo.TOUR_PACKAGE', RESEED, 0);

DELETE FROM TOUR_PACKAGE;

DELETE FROM TOUR_PACKAGE_DATE;


-- Drop the existing table if it exists
DROP TABLE IF EXISTS ReviewDataForTrainingNew;

-- Create a new table with enhanced data
SELECT 
    r.UserId, 
    res.PackageId, 
    r.Rating,
    res.DateOfReservation  -- Add the reservation date or any other relevant columns
INTO 
    ReviewDataForTrainingNew
FROM 
    REVIEW r
JOIN 
    RESERVATION res ON r.ReservationId = res.ReservationId;

-- Select data from the new table to verify
SELECT * FROM ReviewDataForTrainingNew;



