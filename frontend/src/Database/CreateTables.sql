/* products table */
CREATE TABLE products (
    Product_id INTEGER PRIMARY KEY,
    User_id INTEGER, 
    Location_id INTEGER NOT NULL, 
    Title VARCHAR2(200) NOT NULL,
    Description VARCHAR2(1000),
	  Price NUMBER NOT NULL, 
    Is_available INTEGER CHECK (Is_available IN (0,1)),
    Category_id INTEGER,
    Subcategory_id INTEGER,
    Date_posted DATE NOT NULL,
    FOREIGN KEY (User_id) REFERENCES Users(User_id),
    FOREIGN KEY (Category_id) REFERENCES categories(Category_Id),
    FOREIGN KEY (Subcategory_id) REFERENCES subcategories(Subcategory_Id)
);

/* messages table */
CREATE TABLE messages (
    Message_id INTEGER PRIMARY KEY ,
    Sender_id INTEGER, 
    Receiver_id INTEGER, 
    Message VARCHAR2(200),
    Time_stamp TIMESTAMP NOT NULL,
    FOREIGN KEY (Message_id) REFERENCES Users(User_id),
    FOREIGN KEY (Sender_id) REFERENCES Users(User_id)
);

/* image table */
CREATE TABLE images (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Product_id INTEGER NOT NULL,
    Image_link VARCHAR2(255) NOT NULL,
    Image_title VARCHAR(100),
    FOREIGN KEY (Product_id) REFERENCES Product(Product_id)
);

CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    is_admin INTEGER NOT NULL DEFAULT 0 CHECK (is_admin IN (0,1)),
    f_name VARCHAR(50),
    l_name VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE reports (
    Report_Reason_Id VARCHAR(200), 
    Subject_Id_User INTEGER NULL FOREIGN KEY REFERENCES users(User_id),
    Subject_Id_Post INTEGER NULL FOREIGN KEY REFERENCES products(Product_id),
    Subject_Type INTEGER NOT NULL DEFAULT 0 CHECK (Subject_Type IN (0,1)),
    FOREIGN KEY (Report_Reason_Id) REFERENCES report_reasons(Report_Reason_Id)
);

CREATE TABLE report_reasons (
    Report_Reason_Id INTEGER AUTO_INCREMENT PRIMARY KEY,
    Reason_of_Report VARCHAR(200)   
);

CREATE TABLE categories(
	Category_Id INTEGER AUTO_INCREMENT PRIMARY KEY,
	Category_Name VARCHAR(50) NOT NULL
);

CREATE TABLE subcategories(
	Subcategory_Id INTEGER AUTO_INCREMENT PRIMARY KEY,
	Subcategory_Name VARCHAR(50) NOT NULL
);

