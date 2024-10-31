const cache = async (req, res, next) => {
  const key = `program:${req.params.id}`;
  
  try {
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = cache;
