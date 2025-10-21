
export const renderVerificationEmail = (code: any, recipientMail: string): string => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GETHORY Account Verification Code</title>
    <style>
        /* Font Import - Best practice for email is to import first */
        @import url('https://fonts.googleapis.com/css2?family=Gabriela&family=Jersey+25&display=swap');

        /* Basic reset and body styling */
        body, html {
            margin: 0;
            padding: 0;
            /* Use Jersey 25 as the primary font with fallbacks */
            font-family: 'Jersey 25', Arial, 'Helvetica Neue', Helvetica, sans-serif; 
            -webkit-font-smoothing: antialiased;
        }

        /* Main email wrapper */
        .wrapper {
            width: 100%;
            background-color: #f4f7f6;
            padding: 20px 0;
        }

        /* Main content container */
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Header section */
        .header {
            padding: 30px 40px;
            text-align: center;
            background-color: #090A15; /* GETHORY's dark background color */
            color: #ffffff;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            /* Apply Gabriela to the main header for distinct styling */
            font-family: 'Gabriela', cursive; 
        }
        
        /* Gethory Logo/Title Styling */
        .logo-text {
             color: #71E8DF; /* GETHORY's main accent color */
             font-weight: bold;
        }

        /* Body content */
        .content {
            padding: 40px;
            line-height: 1.6;
            color: #333333;
            font-size: 16px;
        }

        .content p {
            margin-bottom: 25px;
        }

        /* The verification code box */
        .code-box {
            background-color: #f9f9f9;
            border: 1px dashed #cccccc;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }

        .code {
             font-size: 20px;
            font-weight: bold;
            color: #111111;
            margin: 0;
            word-break: break-all;
            font-family: 'Courier New', Courier, monospace; 
        }
        
        .important-note {
            color: #DB9C50; /* GETHORY's secondary accent color */
            font-weight: bold;
        }

        /* Footer section */
        .footer {
            padding: 30px 40px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            background-color: #f0f0f0;
            border-top: 1px solid #e0e0e0;
        }

        .footer p {
            margin: 5px 0;
        }

    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            
            <div class="header">
                <h1>Welcome to <span class="logo-text">GETHORY</span>!</h1>
            </div>

            <div class="content">
                <p>Hi [Customer Name],</p>
                
                <p>We're thrilled to have you on board. To complete your account setup and verify your email address, please use the following one-time verification code on the <span class="important-note">verification page</span> in the GETHORY application:</p>

                <div class="code-box">
                    <p style="margin: 0; font-size: 14px; color: #555;">Your verification code (Please copy this code exactly):</p>
                    <p class="code">[Verification Code]</p>
                </div>

                <p>This code is unique to your account and must be entered into the GETHORY app correctly. Please complete the verification process now, as the code will expire soon for your security.</p>
                
                <p>If you did not sign up for an account with GETHORY, you can safely ignore this email.</p>
                
                <p>Thanks,<br>The GETHORY Team</p>
            </div>

            <div class="footer">
                <p>&copy; 2025 GETHORY. All rights reserved.</p>
                <p>Contact support if you need help.</p>
            </div>

        </div>
    </div>
</body>
</html>`;

    html = html.replace('[Verification Code]', code);
    html = html.replace('[Customer Name]', recipientMail);

    return html;
};