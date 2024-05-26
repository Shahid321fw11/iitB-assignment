          FRONTEND                                    BACKEND                                    DATABASE
   +--------------------+                 +-----------------------------+                +-------------------------+
   |   SIGN UP PAGE     |                 |  POST /api/users            |                |       USER SCHEMA       |
   |                    |---------------->|                             |--------------->| +---------------------+ |
   | 1. Username        |                 | - Validate input            |                | | username            | |
   | 2. Email-ID        |                 | - Handle file uploads       |                | | email               | |
   | 3. Password        |                 | - Verify CAPTCHA            |                | | password            | |
   | 4. DOB             |                 | - Save user data            |                | | dob                 | |
   | 5. Photo (JPEG/PNG)|                 |   with isApproved=false     |                | | photo               | |
   | 6. CV (PDF)        |                 | - Respond with success      |                | | cv                  | |
   | 7. CAPTCHA         |                 |   message                   |                | | isApproved (boolean)| |
   +--------------------+                 +-----------------------------+                +---------------------+ |
   |   LOGIN PAGE       |                 |  POST /api/auth/login       |                |                         |
   |                    |---------------->|                             |                +-------------------------+
   | 1. Username        |                 | - Validate input            |
   | 2. Password        |                 | - Verify CAPTCHA            |
   | 3. CAPTCHA         |                 | - Check user approval       |
   +--------------------+                 | - Generate token            |
                                          | - Respond with token        |
                                          +-----------------------------+
   +--------------------+                 |  GET /api/admin/users       |                +-------------------------+
   |  USER DASHBOARD    |                 |                             |                |    USER DATA STORE      |
   |                    |<----------------| - Auth & Admin middleware   |<---------------|                         |
   | - View & update    |                 | - Fetch all users           |                | +---------------------+ |
   |   profile          |                 | - Respond with user list    |                | | user_id             | |
   +--------------------+                 +-----------------------------+                | | username            | |
                                          |  PUT /api/admin/approve/:id |                | | email               | |
   +--------------------+                 |                             |                | | password            | |
   | ADMIN DASHBOARD    |<----------------| - Auth & Admin middleware   |<---------------| | dob                 | |
   |                    |                 | - Approve user              |                | | photo               | |
   | - View users       |                 | - Update user status        |                | | cv                  | |
   | - Approve users    |                 | - Respond with success      |                | | isApproved (boolean)| |
   | - Disapprove users |                 +-----------------------------+                | +---------------------+ |
   +--------------------+                                                                      |
   | - Manage Profile   |                                                                      |
   +--------------------+                                                                      |
                                                                                               v
                                                                                    +-------------------------+
                                                                                    |     USER APPROVALS      |
                                                                                    |                         |
                                                                                    | +---------------------+ |
                                                                                    | | user_id             | |
                                                                                    | | isApproved (boolean)| |
                                                                                    | +---------------------+ |
                                                                                    +-------------------------+
