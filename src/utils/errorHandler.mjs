const NODE_ENV = process.env.NODE_ENV

const errorHandler = (err, req, res, next) => {
    res.status(500).json({
      error: "Internal Server Error",
      message: NODE_ENV === "development" ? "Something went wrong!" : err.stack,
    //   stack : err.stack
    });
  };
  
  export default errorHandler;
  