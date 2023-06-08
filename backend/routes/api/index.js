const router = require('express').Router();
// GET /api/restore-user
const { restoreUser, setTokenCookie, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

// // GET /api/require-auth
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );


// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });


// // GET /api/set-token-cookie
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

module.exports = router;
