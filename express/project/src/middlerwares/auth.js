const adminAuth = (req, res, next) => {
  console.log("checking admin authorization");
  let token = "xyz";
  let isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized user");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("checking user authorization");
  let token = "xyz";
  let isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized user");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
