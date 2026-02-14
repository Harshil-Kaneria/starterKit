exports.objectData = {
    UPLOAD_DIR: "uploads",
    limit: 30,
    paymentAuth: {
        android: {
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1YUrcLCzo0l3v\nDzp6FVM7BzdJOEFSbxMdCEyOMDOC5u4nXIF+CoH7TXQt/nPEe1c5DOUo+2VPoDDT\nqT0x2u6w0nJ6HwHZ8+J+uZSJpgZAkUfzj4v4nALIICCCzUNGSjETloRH0N8qb4pk\nYtbpVvKMfx92X00YXuGo1NkEMpvFPpz2r066c95NxyKCw+NqpkDIWiA3avMEzDPX\nJ0UANW125S8dw3/jCwoU9TwWA8Fs8Y/tMn83KLMLfhX9cLBTpeBvJu2L4myXhILL\nP0Oyby7K/hYZXp6LMnYP0Ex3zEYaHzVhNEqquvsgqCSRwqlQx3sS42JHuIgDvKEs\nTQsTe365AgMBAAECgf93B2IZGuRd5a+/Mj8t3tC/6/xcEI7NihcA9nFG3lrvjJy9\nN/fCvyKNyEZ16IYQauDSj6PTQSc7GeTxAh8mmIYLhA+cFL0iSupYP3E647k2piCR\ntaIlhDxPGMY9EHcVqZqLQDuO5YOOVaR8PGDMwEJr8QC0rdXqKFnucb/5AT04MsP7\ng6azfu8N4hkNWJmaXLY2fr2rI4dIQR7RAEd2YfBlDw0nAcl7rjgS4y5fKn4mP/xV\n8wOKNQH6UcqDhmsBQNDcAEAuQOqZElNNYP+rkj602KMz6O5WnV8niDd04qUuNyTF\nsl0aydA2pFJvyDKiknW3rOT4agrGqucZbz5PWCECgYEA2KMVjfXQMHwsXbmj9BO3\nZtstzgnERVleeBOAjrAgV9R6Y6GRr/K85NHwD/u2qtqOGuqEtNf6JowRR7wdwelo\nz4rD6s8FCKEknxdqvgDoSKbXAVA+NFRXv0kKF4D/TJPYQgE4mxUggzL7zeSJ54JC\n4GjFtv3CoOWT6aZZpWUHxPcCgYEA1lY4yZUtYMpDrgbsp8xS8W5huYxPhWi2Q0aD\nhNg3hTY64H8nPOf5RBzDQpChGqmjQE737KyPPPpa30Vp5HbuGd0L/F2exDBMMl7y\nijCojVZMpv8mTmhO9yDTWxOZApEn+wNGJThrWvkrhcuKE3T2vstvBbvGpU3W67Aa\nfnOm3c8CgYEAimhPah5lv8Rl2A+2B0fdghKAhkXJJwF9ELxtAzzVvSecdjEQ0lgE\nhTD37k5Em439AodY9+2Q/bW5iJpQbMaCVy7yEv/m2GeT7SzZ3sDXpyso7MbmpypH\n0YeJshCRi8xde3YqQzLRTeFx7U6ZKNcZgSSPRWWFRqTGxp2oYrpUp2sCgYEAp4Nz\nlni0onTyOEzJIMub930he3ahn86axDGUEHs7ySz9Dv/RltRmCEnCgX+vqbrzEAun\n0J18xVeVNfJ2NEyPAj+0YmR49TQaGTQDsuUclnngJpQ7SARV0ucgyImkiFESQifo\n5qYVoWAkF8lf/JzpS2yLNJvxQLh5RHK6AiI5RBkCgYEAhZF5ewMLIeQUOvShGmRK\nUPmrqnEOHY5Ed8W5SY7cNMChZxnaM6OOcRWBHB89ZQrEeL25xdcVpfJXloY/pP1i\nTrBDNyaOJFO0Z/CE5kgV8TPFaer1mij6E8QMNjM90BOQ59ieXi4lfoFg5Eaoz8bo\n0i8zYbBTDYMe2nZlBNOE3Bo=\n-----END PRIVATE KEY-----\n",
            clientEmail: "nutriscansubscription@fluid-gamma-447918-f5.iam.gserviceaccount.com",
            packageName: "com.nutriscan",
            productId: 'nutriscan_yearly_plan_android'
        },
        ios: {
            secretId: "5c6a05087f6f457d986e5ad4123a6921",
            mode: "production",
            APPSTORE_KEY_ID: "DLAJ6979U9",
            APPSTORE_ISSUER_ID: "512089cf-43cb-425b-b0f4-278706f9e909",
            APPSTORE_PRODUCT_ID: "6745243301"
        },
    },
    timeRanges: {
        breakfast: { start: "04:30", end: "10:00" },
        lunch: { start: "11:00", end: "16:32" },
        dinner: { start: "18:30", end: "20:00" }
    },
    notificationData: {
        subscription: {
            title: "Your Free Trial is Almost Over!",
            body: "Don't lose access to premium insights! Subscribe now and stay on top of your health journey."
        },
        breakfast: {
            title: "Rise & Nourish!",
            body: "Start your day with a power-packed breakfast! Log your meal now and fuel your goals."
        },
        lunch: {
            title: "Refuel & Recharge!",
            body: "It's lunchtime! A balanced meal keeps you energized. Track your meal and stay on course!"
        },
        dinner: {
            title: "Savor & Stay on Track!",
            body: "A nutritious dinner wraps up a great day! Log your meal now for a healthier tomorrow."
        },
    },
    notificationDataFr: {
        subscription: {
            title: "Votre essai gratuit touche à sa fin !",
            body: "Ne perdez pas l'accès aux informations premium ! Abonnez-vous maintenant et restez au top de votre parcours santé."
        },
        breakfast: {
            title: "Réveillez-vous & Nourrissez-vous !",
            body: "Commencez votre journée avec un petit-déjeuner riche en énergie ! Enregistrez votre repas maintenant et alimentez vos objectifs."
        },
        lunch: {
            title: "Ravitaillez-vous & Rechargez-vous !",
            body: "C'est l'heure du déjeuner ! Un repas équilibré vous garde énergisé. Suivez votre repas et restez sur la bonne voie !"
        },
        dinner: {
            title: "Savourez & Restez sur la bonne voie !",
            body: "Un dîner nutritif conclut une belle journée ! Enregistrez votre repas maintenant pour un demain plus sain."
        }
    }
}
