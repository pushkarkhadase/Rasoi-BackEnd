# FinalYearProjectLinks
These are the links for your final year projects materials<br>

!!!The routes in the blue color are successfully designed and the routes starting with the '?' are yet to be designed.<br>

### Undesigned routes can be temporary or may need to change according to frontend requirement

## DataBase :-<br>
[DataBase Schema:](https://docs.google.com/document/d/1EB5t6nidZ-uaLrclqBgNuNUXR_0b8_8Xe3f0YOEcS1Y/edit) ->  (Structure) <br>
-> Object level schema representation in the google docs
<br>
[DataBase Diagram:](https://lucid.app/lucidchart/72ac2250-c189-44d0-b6d0-b0845389ec7b/edit?page=0_0&invitationId=inv_7960811c-fe12-4e4d-8cad-2b95ce58fb20#) -> (Structure) <br>
-> Class level schema representation in the lucid diagrams
<br>
[ER Diagram:](https://lucid.app/lucidchart/87ea4880-6d98-4f4e-ac0b-67abf15b35be/edit?invitationId=inv_cb15901c-ef36-41a4-bc81-b05194882223&page=0_0#) -> (Diagram) <br>
-> ER diagram
<br>
[Class Diagram:](https://lucid.app/lucidchart/72ac2250-c189-44d0-b6d0-b0845389ec7b/edit?invitationId=inv_7960811c-fe12-4e4d-8cad-2b95ce58fb20&page=0_0#) -> (Diagram) <br>
-> Class diagram
<br>
[Level - 0 DFD:](https://app.diagrams.net/#G1NDX7dXqWNMoOR97M5t0v1sDoVb9-c0Kn) -> (Diagram) <br>
<br>
[Level - 1 DFD:](https://app.diagrams.net/#G1RSEeipc566VYY8Nh4bhXfrjQxLuzI2fy) -> (Diagram) <br>
<br>
[State Transition Diagram:](https://app.diagrams.net/#G1e5g6lzXRWiPTK430PCyw-M4uNHJZx_-Q) -> (Diagram) <br>
<br>





## Customer:-<br>
[Customer SignUP:](https://app.diagrams.net/#G16Hx_NXQksMLIQfrxOyMCmaRZofIKp3Jm) -> (POST) <br>
-> Route for Signup Functionality of Customer which will give us the post request with user data and we will store it into the database<br>
**-> API End Point -> /customer/signUp**
<br>

[Customer LogIn:](https://app.diagrams.net/#G1uO4AbjRaOSnWanhBWAVsVe3qnsPr-Xav)  -> (POST) <br>
-> Route for the LogIn Functionlity for Customer which will give us user credential, then we will compare it with the credential from the backend and if the credentials are correct then we will authorise the user <br>
-> In the positive case we will return that the user is authorized.<br>
**-> API End Point -> /customer/LogIn**

[Get Customer HomePage:](https://app.diagrams.net/#G1VM7lJ4FtcmwyZAMHgn61wG1jP4cyNaJO)  -> (GET) <br>
-> Here we require the data for the sorting as -1,0,1 inorder to give the output as sorted or unsorted order <br>
-> In the output we will give the 12 seller information <br>
**-> API End Point -> /customer/homePage**

[Get Seller Search:](https://app.diagrams.net/#G1KwfM2uP3eQwsqWpm1r32dHDyfoSm-F8h)  -> (GET) <br>
-> Here we need the searching string on whose basis we need to search the record <br>
-> We will return the JSON data of search results <br>
**-> API End Point -> /customer/homePage/search**

[Get Seller Menu:](https://app.diagrams.net/#G1M2oTpkQy7KUcyaxPRnL3p6X6saGIDxTI)  -> (GET) <br>
-> Here we need the seller id on whose basis we need to search the record <br>
-> We will return the JSON data of seller details <br>
**-> API End Point -> /customer/getSellerMenu**

[Place Order:](https://app.diagrams.net/#G1LOpY2aK-Lri2w9fwr9ngaaGi5oxsZAEZ)  -> (POST) <br>
-> Here we need the seller id, customerId, dishes, customerName, customerPhoneNo on whose basis we will place order <br>
-> We will return the order has been created <br>
**-> API End Point -> /customer/placeOrder**

[Customer Profile:](https://app.diagrams.net/#G164jnkc-CKKHLaL4FJYK9WmDedqk1oiJ0)  -> (GET) <br>
-> Here we require the customerId <br>
-> we will give all the required information <br>
**-> API End Point -> /customer/profile**

[Customer Edit Profile:](https://app.diagrams.net/#G164jnkc-CKKHLaL4FJYK9WmDedqk1oiJ0)  -> (PUT) <br>
-> Address, mobileNumber, profileImage, customerId <br>
-> we will return that the user have been updated in the successfull case <br>
**-> API End Point -> /customer/editProfile**

[Add Ratings](https://app.diagrams.net/#G125DU3rNL3LAr-6T0fnKXhydoomckGzIP) -> (PUT) <br>
-> we will take input as OrderId and numeric rating  and then we will update the ratings into out database <br>
-> we will return as Seller have been rated. <br>
**-> API End Point -> /customer/addRatings**

## Seller:-<br>
[Seller SignUp:](https://lucid.app/lucidchart/dc4d3917-ff7e-4191-b0c8-a60818b3a3b7/edit?page=0_0&invitationId=inv_bb7e7ee5-b86c-4cb0-abf2-3b870edb4c54#) -> (POST) <br>
-> Route for Signup Functionality of the seller which will give us the post request with the seller data which we will store into the database <br>
-> we will return that the seller is successfully signed up and also we will send the sms to the seller about the signup<br>
**-> API End Point -> /seller/signUp**

[Seller LogIN:](https://drive.google.com/drive/folders/1pUrMsSIea-3mEjH8qyW1iYwtg160j59h) -> (POST) <br>
-> Route for the Signin Functionality which will give us user credentials which we will check from the database and then authenticate accordingly <br> 
-> if varified & configured then we will send the response as varified, configured and authorized, if varified and not configured  then  varified, not configured and authorised user <br>
-> NOTE:-we will not allow the login process for the non varified user <br>
**-> API End Point -> /seller/logIn**

[Add Dish and Menu:](https://drive.google.com/file/d/124TQpTMjhQ9PyRSrYTBG_ETFp3B-wYUt/view?usp=sharing)  -> (POST) <br>
-> This route will get the data of seller dishes and the menu dishes, then we will store the data into our database. <br>
-> We will return that the dish is saved <br>
**-> API End Point -> /seller/addMenu**

[Configure Seller:](https://drive.google.com/file/d/1ajyZX9QoTnMRvVsN5lskA7WRN-rrFzRQ/view?usp=sharing) -> (PUT) <br>
-> This route will get the all remaining data after the first signIn and update the data base and make the seller as configured seller and then we will <br>
->return that the seller is configured now <br>
**-> API End Point -> /seller/configure**

[Get Seller DashBoard](https://app.diagrams.net/#G1zine2Vv6YgxCAJPhHCasD9vVz4T84EHn) -> (GET) <br>
-> we need the seller ID to search the seller<br>
-> return all the data including the dishes of the seller in for format of JSON <br>
**-> API End Point -> /seller/getDashboard**

[Edit Seller Profile](https://drive.google.com/file/d/1K6QFzhBf1wnqbc0COu4daJw00fei_GII/view?usp=sharing)  ->(PUT) <br>
-> we will take input as seller id and the data that need to be updated into the database and we will update them <br> 
-> we will return seller Profile has been updated <br>
**-> API End Point -> /seller/editProfile**

[Edit Menu Item](https://app.diagrams.net/#G1T5LzESMF_bkZaQRNG_xNLA7IIG5u-XVj)  ->(PUT) <br>
-> we will take input as menu item id and the data that need to be updated into the database and we will update them <br> 
-> we will return menu item has been updated <br>
**-> API End Point -> /seller/editMenuItem**

[Get All Orders:](https://app.diagrams.net/#G1XOl-rGLszVb-qjl5P5ly1XZPJZdGBImd)  ->(GET) <br>
-> we will take input as the sellerId <br> 
-> we will return all the seller orders<br>
**-> API End Point -> /seller/getAllOrders**

[Accept, Reject or MarkAsDelivered Order:](https://app.diagrams.net/#G1iXXn2JCuZQSlI4wzsmFs7lKnriAwetkr)  ->(PUT) <br>
-> Input-> orderId and inString Accept/Reject/MarkAsDelivered<br> 
-> we will return order have been accepted/rejected/OrderDelivered<br>
**-> API End Point -> /sellerAcptRegtMrkAsRd**

## Validator:-<br>
[Seller Validation Get Data:](https://app.diagrams.net/#G1So0gtjBx--CzbdorYsl8G9ovd6-nNsqQ) -> (GET)<br>
-> This Route will find the unvalidated users and send their data to frontend in order to display and validate them.<br>
-> We will return the list of seller data json in case we found any unvalidated user else we will return that all the sellers are verified.<br>
**-> API End Point -> /validator/getValidationData**

[Seller Validation Success:](https://drive.google.com/file/d/1gUJJN-A7PYzwqbm64xqIclmACnKkQuS9/view?usp=sharing) -> (PUT) <br>
-> This route will accept the put request from the front end in order to make changes in the database and validate them or reject them <br>
-> Data recieved will be sellerid that is validated  <br>
-> we will return as Seller validation successfull. or reject3ed <br>
**-> API End Point -> /validator/ValidateOrReject**






## Seller Location and ratings are holded due to front end reasons and are under revise

#under maintainance
(get)
We need to give customer details 
Path -> /customer/getintro
 Customer Name , customer mobile number , customer address

This will be used in the profile page of customer introduction
Json key value pair will be according to database.








