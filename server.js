const express = require("express");
const app = new express()
const path = require('path')
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'build')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// start express server on port 5000
app.listen(PORT, () => {
  console.log("Listening on port",PORT);
});