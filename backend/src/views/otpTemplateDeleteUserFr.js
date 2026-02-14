module.exports = (data) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nutriscan - OTP</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #f4f9fd;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background: linear-gradient(145deg, #ffffff, #f0f8ff);
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e1e1e1;
        }
        .header {
            background: linear-gradient(90deg, #007bff, #00d4ff);
            padding: 25px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: bold;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 16px;
            font-style: italic;
        }
        .body {
            padding: 25px;
            background-color: #ffffff;
        }
        .body p {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.8;
            color: #555;
        }
        .otp-container {
            text-align: center;
            margin: 25px 0;
        }
        .otp-display {
            display: inline-block;
            background: #f8f9fa;
            color: #212529;
            font-size: 24px;
            font-weight: bold;
            font-family: monospace;
            padding: 15px 30px;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            letter-spacing: 3px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: linear-gradient(90deg, #00d4ff, #007bff);
            font-size: 14px;
            color: #ffffff;
        }
        .footer a {
            color: #ffeb3b;
            text-decoration: none;
            font-weight: bold;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .header h1 {
                font-size: 22px;
            }
            .body p {
                font-size: 14px;
            }
            .otp {
                font-size: 18px;
                padding: 12px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Bienvenue chez NutriScan AI !</h1>
        </div>
        <div class="body">
            <p>Salut,</p>
            <p>Votre mot de passe à usage unique (OTP) pour la suppression de compte est :</p>
            <div class="otp-container">
                <div class="otp-display">${data.otp}</div>
            </div>
            <p>Merci de le garder confidentiel</p>
            <p>Merci d'avoir choisi NutriScan AI. Si vous n'avez pas demandé ceci, merci d'ignorer cette e-mail.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Nutriscan. Tous droits réservés.</p>
            <p>Besoin d'aide ? <a href="mailto:support@nutri-scan.com">Contacter le support</a></p>
        </div>
    </div>
</body>
</html>
`