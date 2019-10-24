# CS_467_400_U2019

#Initial SQL creation scripts:

#User Table

CREATE TABLE IF NOT EXISTS `User` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(40) NOT NULL,
  `FirstName` varchar(40) DEFAULT NULL,
  `LastName` varchar(40) DEFAULT NULL,
  `TimeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Signature` blob,
  `SoftDelete` binary(1) NOT NULL DEFAULT '0',
  `IsAdmin` binary(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `UserName` (`UserName`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

#Add user test data

INSERT INTO `User` (`Id`, `UserName`, `FirstName`, `LastName`, `TimeStamp`, `Signature`, `SoftDelete`, `IsAdmin`) VALUES
(1, 'user1@user.com', 'UserOneFirstName', 'UserOneLastName', '2019-07-11 14:46:55', NULL, '0', '0'),
(2, 'user2@user.com', 'UserTwoFirstName', 'UserTwoLastName', '2019-07-11 14:46:55', NULL, '0', '0'),
(3, 'user3@user.com', 'UserThreeFirstName', 'UserThreeLastName', '2019-07-11 14:46:55', NULL, '0', '0'),
(4, 'admin1@admin.com', 'AdminOneFirstName', 'AdminOneLastName', '2019-07-11 14:46:55', NULL, '0', '1'),
(5, 'admin2@admin.com', 'AdminTwoLastName', 'AdminTwoLastName', '2019-07-11 14:46:55', NULL, '0', '1');

#Award table

CREATE TABLE IF NOT EXISTS `Award` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TypeOfAward` varchar(40) NOT NULL,
  `NameOfAwardee` varchar(40) NOT NULL,
  `EmailAddress` varchar(40) NOT NULL,
  `DateTimeAward` datetime NOT NULL,
  `Department` varchar(40) NOT NULL,
  `UserName` varchar(40) NOT NULL,
  `SoftDelete` binary(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `UserName` (`UserName`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

ALTER TABLE `Award`
  ADD CONSTRAINT `Award_ibfk_1` FOREIGN KEY (`UserName`) REFERENCES `User` (`UserName`);
  
  
  INSERT INTO `Award` (`Id`, `TypeOfAward`, `NameOfAwardee`, `EmailAddress`, `DateTimeAward`, `Department`, `UserName`, `SoftDelete`) VALUES
(2, 'EmployeeOfMonth', 'Bob Smith', '', '2019-07-01 17:47:56', 'Sales', 'user1@user.com', 0),
(3, 'EmployeeOfWeek', 'Jane Doe', 'jane@doe.com', '2019-07-11 17:47:52', 'Engineering', 'user2@user.com', 0);
  
