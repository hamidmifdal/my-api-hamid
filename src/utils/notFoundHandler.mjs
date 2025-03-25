const NODE_ENV = process.env.NODE_ENV

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      error: "Not Found",
      message: NODE_ENV === "development" ? `Route ${req.originalUrl} not found` : "The requested resource could not be found.",
    });
  };
  
  export default notFoundHandler;
  