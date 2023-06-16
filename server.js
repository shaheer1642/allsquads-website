const express = require("express");
const app = new express()
const path = require('path')
const PORT = process.env.PORT || 3000

app.get('/supportsofty',(req,res) => {
  res.redirect('https://patreon.com/join/mrsofty')
})

app.get('/donatesofty',(req,res) => {
  res.redirect('https://patreon.com/join/mrsofty')
})

app.use((req,res,next) => {
  if (req.subdomains.length > 0) {
    if (req.subdomains[0] == 'relic')
      return res.redirect('https://discord.com/invite/Kyf6NAuEsa')  // discord server 
    else if (req.subdomains[0] == 'relics')
      return res.redirect('https://discord.com/invite/Kyf6NAuEsa')  // discord server 
    else if (req.subdomains[0] == 'discord')
      return res.redirect('https://discord.com/invite/Kyf6NAuEsa')  // discord server 
    else if (req.subdomains[0] == 'www')
      return next() // website
    else if (req.subdomains[0] == 'dev')
      return next() // website
  } else {
    return next() // website
  }
})

app.use(express.static(path.join(__dirname, 'build')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// start express server on port 5000
app.listen(PORT, () => {
  console.log("Listening on port",PORT);
});