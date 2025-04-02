# AWS EC2 Linux 2 Deployment Guide

## Connecting to Your AWS Instance

1. **Prepare your SSH key**

   - Download your key file (`.pem`) from AWS

   - Move the key file to your `.ssh` folder

   - Set proper permissions for the key file:

     ```bash
     chmod 400 "File_name.pem"
     ```

2. **Connect to your instance via SSH**

   - Use the SSH command provided by AWS:

     ```bash
     ssh -i "File_name.pem" ec2-user@ec2-xx-xxx-xx-xxx.compute-1.amazonaws.com
     ```

   - Example:

     ```bash
     ssh -i "First Application Validation Instance.pem" ec2-user@ec2-54-197-37-129.compute-1.amazonaws.com
     ```

   - You'll know you're connected when your terminal shows the instance's private IP instead of your local computer

## Setting Up the Environment on Your EC2 Instance

### 1. Update the System and Install Git

```bash
sudo yum update -y
sudo yum install git -y
```

### 2. Install Node.js and npm using NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install --lts
```

- Verify installation:

  ```bash
  nvm --version
  node --version
  npm --version
  ```

- If needed, install a specific version:

  ```bash
  nvm install 16
  ```

### 3. Clone Your Repository

```bash
cd ~
git clone repository-url
```

### 4. Navigate to Your Project Directory

```bash
cd repository_name
```

- Useful commands:

  ```bash
  ls -la     # List all files in current directorypwd        # Show current directory path
  ```

### 5. Install Project Dependencies

```bash
npm install
```

## Setting Up the Database (MySQL/MariaDB)

### 1. Install MariaDB

```bash
sudo yum install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

### 2. Secure Your MariaDB Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts:

- Enter current root password (press Enter if none)
- Set a root password (Example: Honky@101)
- Remove anonymous users? (Y)
- Disallow root login remotely? (Y)
- Remove test database? (Y)
- Reload privilege tables? (Y)

### 3. Create a Database and Table

1. Login to MySQL:

   ```bash
   sudo mysql -u root -p
   ```

2. Create and use a database:

   ```sql
   CREATE DATABASE userdb;
   USE userdb;
   ```

3. Create a table:

   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL unique,
       email VARCHAR(100) NOT NULL unique,
       password VARCHAR(255) NOT NULL
   );
   ```

4. Verify table creation:

   ```sql
   DESCRIBE users;
   ```

## Configuring Your Application

### 1. Create an Environment File

```bash
nano .env
```

- Copy the structure from your local `.env` file
- Save with `CTRL+X`, then press `Y`

### 2. Start Your Application

```bash
npm run dev
```

- If you need to set permissions for nodemon:

  ```bash
  chmod +x ./node_modules/.bin/nodemon
  ```

## Accessing Your Application

- Access your application via:

  ```
  http://54.197.37.129:3000/homepage
  ```

  (Replace with your actual IP address)

- If you can't connect, check the port range in the Security Group settings for your EC2 instance
