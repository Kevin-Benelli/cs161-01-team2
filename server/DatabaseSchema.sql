create Table User(
UserID int not null AUTO_INCREMENT,
username varchar (255),
password varchar(255), 
primary key (UserID)
);

create Table UserLogin (
FK_UserID int not null,
Login time,
Day Date,
Foreign key (FK_UserID) References UserLogin(UserID)
);