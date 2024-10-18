const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Εδώ θα προσθέσουμε τους δρομολογητές (routes) αργότερα

app.listen(port, () => {
  console.log(`Η εφαρμογή Wellness ακούει στη θύρα ${port}`);
});
