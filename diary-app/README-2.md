# FinalProject - Part 2
<code>Jennifer Cruz</code>

## Project Overview: 

<p> This project relates to developing ThoughtStream which is a digital diary allowing users to reflect, record, and remember. This project is using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

Key features include allowing users to read, create, update, and delete diary entries. </p>

<br><b> Part Two Introduction:</b><p>
Part 2 of the ThoughtStream project allows for user authentication and authorization to be implemented. This is achieved using Google OAuth 2.0 with the passport-google-oauth20 strategy. This section aims to ensure that each diary entry is securely linked to an authenticated user, and only they have access to view, modify, or delete their entries.

<b> Why use Google OAuth 2.0: </b><br>
The reason for selecting Google OAuth 2.0 was because it offers a secure method of seamless login, where users can use their existing Google accounts, eliminating the need for password management or storage. This also allows the ThoughtStream to speed up user onboarding and reduce any potential issues in authentication as it is handled on Google's side.

<br>
<b>Frontend Changes:</b> <br>
At the moment, login and authentication is handled through a browser redirect, or static link such as <code> http://localhost:5000/auth/google</code>. However, once the frontend is implemented, it should provide a button 'Login' with Google, that connects with the backend authentication endpoint, to allow for sessions within the app.

<br>
<b>Packages & Middleware:</b>
<br>

- **passport**: The main authentication framework.
- **passport-google-oauth20**: This is the Google OAuth 2.0 strategy for Passport.
- **express-session**: This stores and manages user sessions.
- **connect-mongo**: Allows for persistent storage in MongoDB.
- **dotenv**: Manages the environment variables securely.
</p>

## Google Cloud Console Workflow:
<b>To allow for Google login, follow these steps:</b>

**1**: Head to https://cloud.google.com/cloud-console

**2**: Create a new project.

**3**: Go to APIs & Services, click Credentials.

**4**: Click Create Credentials, then OAuth client ID
- Application type: Web Application
- Authorized redirect URL: http://localhost:5000/auth/google/callback

**5**: Copy the generated Client ID and Client Secret

**6**: Use these Google credentials in your .env file, it should look like this: <br>
```js
GOOGLE_CLIENT_ID=your-google-client-id 
GOOGLE_CLIENT_SECRET=your-google-client-secret 
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

<p><b>OAuth20:</b><br>
OAuth 2.0 refers to the secure authorization protocol which allows users to approve access into apps without having the need to reveal their credentials. It also handles verification for identities using a token exchange, after the user has given their consent.
</p>


## Authentication Flow Description:
**During the login process:** <br>
**1**: The user navigates to http://localhost:5000/auth/google, where upon success, redirects to Google for login.

**2**: Once the user gives consent, Google redirects to  http://localhost:5000/auth/google/callback.

**3**: Passport extracts user profile data using GoogleStrategy.

**4**: If that user exists in MongoDB, it logs them in

**5**: The express-session stores a session ID using the connect.sid cookie. This allows the app to maintain the user's login environment. 

## Environment Variables:
```js
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/diary-app 
WEATHER_API=your_openWeather_key 
GOOGLE_CLIENT_ID=your-google-client-id 
GOOGLE_CLIENT_SECRET=your-google-client-secret 
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback 
SESSION_SECRET=your-session-secret 
PORT=5000 
NODE_ENV=development 
```

## Mongoose Models and Schema Changes:
### User Model
<p> The user model contains information for the user to be authenticated by GoogleOauth. This model serves as the owner of existing or any new diary entries the user creates.</p>

```js
googleId: {type: String, required: true, unique: true},
name: String, 
email: String,
picture: String
{timestamps: true}
```
<p> 
The diaryEntry.js model includes each entry created by the user, each diaryEntry is associated with one User, as indicated by the <code> user </code>field, as seen:
</p>

```js
user: { type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true }, // User who owns the entry
```

<p>From this model we can apply a relationship so that our User Model has a relationship in the diary entry. This means that a diary entry is linked to the authenticated user who owns it. This is seen in the diaryController.js: </p>

```js
user: req.user.id,
```
<p>This is then used to validate the user's ownership of the entries before completing an action, such as when fetching an entry by user ID:
</p>

```js
if (entry.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
}
```

## Route Protection:
<p> Custom middleware function, <code>ensureAuthenticated</code>, was created to protect the routes by first checking to make sure that the user is authenticated before proceeding with the route.</p>

### Code:
<i>In authMiddleware.js:</i>
```js
export const ensureAuthenticated = (req, res, next) => { 
    if (req.isAuthenticated()) { 
        return next(); 
    } 
    res.status(401).json({ message: "Unauthorized"}) 
    }; 
```
### Usage:
<i>In diaryRoutes.js: </i>
```js
import { ensureAuthenticated } from "../middleware/authMiddleware.js";


router.get("/", ensureAuthenticated, getAllEntries);
```
This means that only logged-in users can access the routes, anything else will return a 401 error saying "Unauthorized"

## Logout Route:
<i> In authRoutes.js </i>

<i> Route:</i>
```js
@route GET /auth/logout
```
<i>Implementation:</i>
```js
router.get("/logout", (req, res) => {
    req.logout(function (err){
        if (err){
            return res.status(500).json({message: "Logout failed."});
        }
        res.status(200).json({message: "Logout successful."});
    });
});
```
<p> This was created by first, getting the route for logout, "/logout". Then we call req.logout() which ends the session and clears session cookies. req.logout() also handles destroying the session on the server side, meaning the session cookie will no longer be sent in any future requests. On success, a 200 status is returned, if this fails then a 500 status is returned indicating logout has failed. </p>


## Testing Strategies:
### Outlined steps for Authentication and Login testing, with Postman:
<p>

<i> *note: the server must be on to initiate testing. </i>

## **1**: Login
- Navigate to: http://localhost:5000/auth/google in your browser. This triggers the GoogleOAuth2.0 authentication flow.
- Log in and grant consent
- On success, this will redirect you and your URL will look like: http://localhost:5000/auth/google/callback
- This means that the session has been established, and the cookie has been set.

## **2**: Fetch the Cookie 🍪
- Open Developer Tools in your browser, then to Application > Cookies > connect.sid
- Copy the connect.sid value.

## **3**: Postman
- In Postman, go to Cookies. (just under the send button)
- Add the Cookie Value, Domain: localhost, Name: connect.sid 

## **4**: Test a protected route
- Enter a GET request in Postman, for example:
``` js
GET http://localhost:5000/api/diary → Success
```
- With cookie: 200 OK - Successfully return the entries that the user owns.
- Without cookie: 401 Unauthorized - No cookie, user not authenticated.
</p>

## **Example: Request with cookie**
<img src='./cookie-success.png'>

## **Example: Request without cookie**
<img src='./cookie-fail.png'>


## Known Issues or Future Improvements:
<p>

- **Hardcoded User ID**: This was removed in part 2 as authentication was implemented. All the entries can now be associated with the approved user.

- **Improved Error Feedback**: Currently, ThoughtStream uses basic error messages. A future improvement can allow for more descriptive error handling. This way, we can find problem areas in the code more easily.

- **Frontend Integration**: Currently, the user must navigate to a static link: http://localhost:5000/auth/google. A future improvement can be to implement login via a frontend UI. This could be a button that leads the user to GoogleAuthO2.0 authentication flow.

</p>
