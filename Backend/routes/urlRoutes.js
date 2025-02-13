const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const { generateShortCode, generateQRCode } = require("../services/urlServices");

router.get('/', (req, res) => {
  console.log("hellloo request gotten ");
  return res.json({ message: "Server is running !!!" })
})
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      console.log("User already exist");
      return res.status(403).json({ massage: "User already exisits" });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(200).json({ message: "User saved successfully", email })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server error" });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      console.log("No email or password", email, password);
      return res.status(404).json({ message: "Credential not founded" })
    }
    const existUser = await User.findOne({ email });

    if (existUser) {
      const isPassCorrect = password == existUser.password;
      if (isPassCorrect)
        return res.status(200).json({ message: "Successfully loggedin", email });
      else
        return res.status(404).json({ message: "Password incorrect" });
    } else {
      return res.status(404).json({ message: "Email not Founded, Register now!" })
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
})

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const email = JSON.parse(id)?.email
  // console.log(email)
  if (!id) {
    console.log("Id is not founded!")
    return res.status(404).json({ message: "user not founded" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      let data = []
      if (user.urls.length > 5) {
        data = user.urls.slice(-5);
      } else {
        data = user.urls
      }
      // console.log("User successfully fetched");
      return res.status(200).json({ message: "User successfully fetched", data })
    } else {
      console.log("User not founded");
      return res.status(404);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }

})

router.post("/shorten/:id", async (req, res) => {

  const { longUrl } = req.body;
  const shortCode = generateShortCode();
  const qrCode = await generateQRCode(longUrl);
  const { id } = req.params;

  if (!id) {
    console.log("Id is not founded!")
    return res.status(404).json({ message: "user not founded" });
  }
  const user = await User.findOne({ email: id });
  if (!user) {
    console.log("User not founded");
    return res.status(404);
  }
  const isExisitLongUrl = user.urls.find((ele) => ele.longUrl == longUrl);
  if (isExisitLongUrl) {
    const { shortCode, qrCode } = isExisitLongUrl;
    console.log("Long url already exisits and fetched short one!")
    return res.json({ shortCode, qrCode });
  }
  try {
    const urlData = {
      longUrl, shortCode, qrCode
    }
    user.urls.push(urlData);
    await user.save();
    res.json({ shortCode, qrCode });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:shortCode", async (req, res) => {
  try {
    const user = await User.findOne({ "urls.shortCode": req.params.shortCode });

    if (user) {
      const urlData = user.urls.find(url => url.shortCode === req.params.shortCode);

      if (urlData) {
        return res.redirect(urlData.longUrl);
      }
    }

    res.status(404).json({ error: "URL not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;