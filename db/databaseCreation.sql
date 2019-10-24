
CREATE TABLE IF NOT EXISTS User (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  UserName varchar(64) UNIQUE,
  Email varchar(64) UNIQUE,
  FirstName varchar(64) NOT NULL,
  LastName varchar(64) NOT NULL,
  TimeStamp datetime DEFAULT CURRENT_TIMESTAMP,
  Signature varchar(128),
  SoftDelete BOOLEAN DEFAULT 0,
  IsAdmin BOOLEAN NOT NULL DEFAULT 0
 );


INSERT INTO User (UserName, Email, FirstName, LastName, TimeStamp, Signature, SoftDelete, IsAdmin) VALUES
('auth0|5d2a50668935cd0e8a322637', 'user1@user.com', 'UserOneFirstName', 'UserOneLastName', '2019-07-11 14:46:55', "signature1.png", '0', '0'),
('auth0|5d2a50908935cd0e8a322639', 'user2@user.com', 'UserTwoFirstName', 'UserTwoLastName', '2019-07-11 14:46:55', "signature2.png", '0', '0'),
('auth0|5d2a50ac5171f20e7057b9c8', 'user3@user.com', 'UserThreeFirstName', 'UserThreeLastName', '2019-07-11 14:46:55', "signature3.png", '0', '0'),
('auth0|5d2a50c5ba4a7e0d2be7de96', 'admin1@admin.com', 'AdminOneFirstName', 'AdminOneLastName', '2019-07-11 14:46:55', "", '0', '1'),
('auth0|5d2a50dba6d2ce0e4497e1d4', 'admin2@admin.com', 'AdminTwoLastName', 'AdminTwoLastName', '2019-07-11 14:46:55', "", '0', '1');


CREATE TABLE IF NOT EXISTS Award (
  Id 	INTEGER PRIMARY KEY AUTOINCREMENT,
  TypeOfAward 	varchar(64) NOT NULL,
  NameOfAwardee varchar(64) NOT NULL,
  EmailAddress 	varchar(64) NOT NULL,
  DateTimeAward datetime 	NOT NULL,
  Department 	varchar(64) NOT NULL,
  UserName 		varchar(64) NOT NULL,
  SoftDelete 	BOOLEAN 	DEFAULT 0,
  FOREIGN KEY(username) REFERENCES user(username)
);

  
INSERT INTO Award (TypeOfAward, NameOfAwardee, EmailAddress, DateTimeAward, Department, UserName, SoftDelete) VALUES
('Employee Of the Month', 'Bob Smith', 'bob@smith.com', '2019-07-01', 'Sales', 'auth0|5d2a50668935cd0e8a322637', 0),
('Employee Of the Week', 'Jane Doe', 'jane@doe.com', '2019-07-11', 'Engineering', 'auth0|5d2a50908935cd0e8a322639', 0);
  
