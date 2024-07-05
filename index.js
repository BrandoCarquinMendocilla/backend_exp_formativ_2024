const express = require('express');
const session = require('express-session');
const cors = require('cors');
const apiPublic = require('./src/Routes/api-public/index');
const passportAPi = require('./src/Routes/passport');
const apiPrivate = require('./src/Routes/api-private/index');
const middleware = require('./src/middleware');

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { default: axios } = require('axios');

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

require('dotenv').config();


require('./common/mongosse')
const PORT = process.env.PORT || 3000;


const app = express();

app.use(session({
  secret: 'secret-key', 
  resave: false,
  saveUninitialized: false
}));


app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



// Middleware para habilitar CORS
const corsOptions = {
  origin: ['http://localhost:3001', 'https://accounts.google.com'],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Aplica tu middleware
app.use('/v1', middleware.limiter);

// Monta las rutas de v1
app.use('/v1', apiPublic);
app.use('/auth/google', passportAPi);

app.get('/gmail', async (req, res) => {
  try {
    
      const accessToken = req.query.access_token
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`);

      const userData = await response.json();
      res.json(userData); // Devuelve los datos del usuario obtenidos de la API de Google
  } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

// Validación de token de session
app.use('/v1', middleware.loadSession);

app.use('/v1/private', apiPrivate);

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
      error: {
          message: err.message,
          user: err.user || 'Ocurrió un error'
      }
  });
});


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
