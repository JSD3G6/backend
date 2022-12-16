const app = require("./app");

// at first when start server && after send response : Ready listen for next Request
const port = process.env.DEV_PORT || 8000;
app.listen(port, () => console.log(`app is running in port ${port}`));
