 const  catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };   // like next( new ApiErri())
  };
  
  export default catchAsync