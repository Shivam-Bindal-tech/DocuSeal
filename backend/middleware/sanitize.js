const sanitize = (req, res, next) => {
  if (req.body.uploader) {
    req.body.uploader = req.body.uploader.replace(/[^a-zA-Z0-9 ]/g, "");
  }
  next();
};

module.exports = sanitize;
