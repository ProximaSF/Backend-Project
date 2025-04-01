1. After creating a instance, connect the instance using SSH
   1. Locate the folder/directory where the token was downloaded.
      1. Put in .SSH folder after downloading the token
   2.  In Git Bash terminal enter: `chmod 400 "File_name.pem"` to enable permission
   3. Than type: `ssh -i "File_name.pem" ...amazonaws.com`
      1. Full command should be in the SSH instruction
   4. If successful connecting, the bash terminal should be connected to the AWS instance via a private IP address, not the local computer. 