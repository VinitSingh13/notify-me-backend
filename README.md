# notify-me-backend

Notify-Me App:
The basic idea behind Notify-Me App is to get a message on whatsapp about a received email. For every message we receive on our email we get notification from our gmail app, which is 
very convinient, but there is an issue with this. The issue is gmail app sends notification for every email we receive. Wether it is normal inbox. Message about notifications sent 
by apps like linkedin, instagram, facebook, etc. Message from apps for there promotions, like message sent from "make my trip" , that theres a discount on flights and so on. This 
leads to a lot of notifications we receive on our phones and due to so much of notification sometimes we tend to miss some important emails which are from our work.

Login page

![alt text](https://github.com/VinitSingh13/notify-me-backend/blob/master/images/notify-login-page.png?raw=true)

Home Page

![alt text](https://github.com/VinitSingh13/notify-me-backend/blob/master/images/notify-home-page.png?raw=true)

How Notify-Me App Works ??
1. Login to app, set keywords or mail id of those people whose notification you want to get on your whatsapp
2. Once you have selected the keywords, its done, and now if you receive a new mail and  any keyword or mail id matches, from your selected list, you will receive a message
   about it on your whatsapp directly.

Tech Stack Used For this Web App are:
1. ReactJs in Frontend
2. NodeJS, Express, MongoDB, mongoose, Restful Api in Backend
3. Gmail Api is used to get email messages information, OAuth 2.0 is used for authorization and authentication, google-api-nodejs client library
   is used to communicate with gmail api and for authentication as well.
4. Twilio(free version) is used to send message on whatsapp.   
    
