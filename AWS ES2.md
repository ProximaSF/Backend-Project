1. After creating a instance, connect the instance using SSH
   1. Locate the folder/directory where the token was downloaded.
      1. Put in .SSH folder after downloading the token
      
   2. In Git Bash terminal enter: `chmod 400 "File_name.pem"` to enable permission
   
   3. Than type: `ssh -i "File_name.pem" ...amazonaws.com`
      1. Full command should be in the SSH instruction
      
         `ssh -i "First Application Validation Instance.pem" ec2-user@ec2-54-197-37-129.compute-1.amazonaws.com`
      
   4. If successful connecting, the bash terminal should be connected to the AWS instance via a private IP address, not the local computer. 

Bash Install (if not installed) for Windows <u>inside the instance server:</u>

1. Update package repositories and install any dependencies:

   ```bash
   sudo yum update -y
   sudo yum install git -y
   ```

2. Node.js and npm 

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   source ~/.bashrc
   nvm install node
   ```

3. Git (used for clone repository)

   ```bash
   sudo yum install git -y
   ```

   - ```bash
     cd ~
     git clone repository-url
     ```

4. After a successful git clone, navigate to that directory

   ```bash
   cd repository_name
   ```

   1. Check files in current directory: `ls -la`
   2. Get current directory path: `pwd`

5. Install required application dependencies

   - **Install Node.js using Node Version Manager (NVM) (If not installed)**

     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
     ```

     - Activate NVM

         ```bash
         source ~/.nvm/nvm.sh
         source ~/.bashrc
         ```

     - Check if installed

         ```bash
         nvm --version
         ```
   
     - Install the latest LTS version of Node.js:
   
       ```bash
       nvm install --lts
       ```
   
     - Check if Node.js and npm installed
   
       ```bash
       node --version
       npm --version
       ```
   
       - If not try:
   
         ```bash
         nvm install 16
         ```
   
   - Once node and NVM is on the computer
   
     - Make sure package.js is all in the directory
   
       ```bash
       # Create a new directory for your project
       mkdir my-node-project
       cd my-node-project
       
       # Initialize a new Node.js project
       npm init -y
       ```
     
       
     
     - install npm: 
     
       ```bash
       npm install
       ```
     
     - Install MySQL for to make the database work
     
       ```bash
       sudo yum install mysql -y
       ```
     
       
     
     