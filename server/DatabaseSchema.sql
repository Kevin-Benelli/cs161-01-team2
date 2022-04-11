CREATE TABLE scores (
  scoreID int NOT NULL AUTO_INCREMENT,
  room varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  userscore int DEFAULT NULL,
  questionlength int DEFAULT NULL,
  gameID varchar(255) DEFAULT NULL,
  timestamp datetime DEFAULT NULL,
  PRIMARY KEY (scoreID,room,username)
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE users (
  username varchar(255) NOT NULL,
  password varchar(255) DEFAULT NULL,
  PRIMARY KEY (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

create Table UserLogin (
FK_User varchar(255) not null,
Login time,
Day Date,
Foreign key (FK_User) References users(username)
);

create Table Game (
GameID int not null,
DateofGame Date,
TitleOfGame Varchar(255),
NumberOfPlayers int,
primary key (GameID)
);

create Table Player (
FK_GameID int not null,
FK_Username Varchar(255) not null,
Score double,
Place int,
foreign key (FK_GameID) references Game(GameID),
foreign key (FK_Username) references users(Username)
);

create Table Questions(
QuestionID int not null auto_increment,
Category Varchar (255),
QuestionInfo TEXT(65535),
primary key (QuestionID)

)