//  # signup / login
import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const checkToken = (req, res) => {
    console.log('req.user', req.user)
    res.json(req.exp)
}

const dataController = {
  async create (req, res, next) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.locals.data.user = user;
    res.locals.data.token = token;
    next();
  } catch (e) {
    if (e?.code === 11000) {
      // duplicate email
      return res.status(409).json({ error: 'email_in_use', message: 'Email is already registered.' });
    }
    if (String(e?.message || '').includes('secretOrPrivateKey')) {
      return res.status(500).json({ error: 'server_misconfig', message: 'Auth secret missing on server.' });
    }
    console.error('Signup error:', e);
    return res.status(400).json({ error: 'signup_failed', message: e?.message || 'Could not create user.' });
  }
},

  async login (req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) throw new Error()
      const match = await bcrypt.compare(req.body.password, user.password)
      if (!match) throw new Error()
      res.locals.data.user = user
      res.locals.data.token = createJWT(user)
      next()
    } catch {
      res.status(400).json('Bad Credentials')
    }
  }
}

const apiController = {
  auth (req, res) {
    res.json({
      token: res.locals.data.token,
      user: res.locals.data.user
    })
  }
}

export {
  checkToken,
  dataController,
  apiController
}

/* -- Helper Functions -- */

function createJWT(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}