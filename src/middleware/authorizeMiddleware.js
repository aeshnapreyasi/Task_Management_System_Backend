function authorizeManager(req,res,next) {
  if(req.userRole !== "MANAGER"){
    return res.status(403).json({
      success: false,
      message: "Access denied. Manager only.",
    });
  }

  next();
}

module.exports = authorizeManager;