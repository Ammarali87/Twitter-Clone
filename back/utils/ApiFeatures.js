//  class name start with Cap
// add this to every thing
// no this in new var from var just one this 


// the use of class 
// const features = new ApiFeatures(Model.find()
// , req.query)     starit with search 
//   .search()     // First apply search
//   .filter()     // Then apply filters
//   .sort()       // Sort results
//   .limit()// Select specific fields
//   .paginate(totalCount); // Finally paginate
// can remove {} from if if one line 



class ApiFeatures {
  constructor(query, queryString) {
    // queryString == paramter 
    // query  ready to find() 
    this.query = query;    // to create variables in Class use this  
    this.queryString = queryString;
  } 
  
//  can add    if (modelName === 'User') { any code} 
// Expample 
// search(modelName) {
  // if (this.queryString.search) {
    // if (modelName === 'User') {
      // Fuzzy search for User model (e.g., by name or email)
      // const searchObj = {
        // $or: [
          // { name: { $regex: this.queryString.search, $options: 'i' } },

  //  Example 2

  // search(modelName) {
  //   if (this.queryString.search) {
  //     let searchObj = {};
  
  //     switch (modelName) {
  //       case 'User':
  //         searchObj = {
  //           $or: [
  //             { name: { $regex: this.queryString.search, $options: 'i' } },
  //             { email: { $regex: this.queryString.search, $options: 'i' } }
  //           ]
  //         };
  //         break;
  
  //       case 'Product':
  //         searchObj = {
  //           $or: [
  //             { title: { $regex: this.queryString.search, $options: 'i' } },
  //             { description: { $regex: this.queryString.search, $options: 'i' } }
  //           ]
  //         };
  //         break;
  
  //       // You can add more models here
  //       case 'Category':
  //         searchObj = {
  //           name: { $regex: this.queryString.search, $options: 'i' }
  //         };
  //         break;
  
  //       default:
  //         // fallback search on 'title' and 'description' fields
  //         searchObj = {
  //           $or: [
  //             { title: { $regex: this.queryString.search, $options: 'i' } },
  //             { description: { $regex: this.queryString.search, $options: 'i' } }
  //           ]
  //         };
  //     }
  
  //     this.query = this.query.find(searchObj);
  //   }
  
  //   return this;
  // }
  



  search(modelName) { 
    if (this.queryString.search) {
      // here can make fuzzy search 
      const searchObj = {
        // like ?  take logic 
        $or: [
          { title: {
             $regex: this.queryString.search,
              $options: 'i' } },
          { description: { $regex: this.queryString.search, $options: 'i' } }
        ]
      };
      this.query = this.query.find(searchObj);
    }  
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'field', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);
      // can make without exclude const 
    const filterObject = { ...queryObj };
      
    // Handle rating filters
    if (this.queryString.rating) {
      filterObject.ratingsAverage = {
        $gte: parseFloat(this.queryString.rating) - 0.4,
        $lte: parseFloat(this.queryString.rating) + 0.4
      }; 
    } else if (this.queryString.ratingMin || this.queryString.ratingMax) {
      filterObject.ratingsAverage = {};
       filterObject.ratingsAverage.$gte =
        parseFloat(this.queryString.ratingMin) || 1;
       filterObject.ratingsAverage.$lte =
        parseFloat(this.queryString.ratingMax) || 5;
    }

    // Handle price filters
    if (this.queryString.priceMin || this.queryString.priceMax) {
      filterObject.price = {};
      filterObject.price.$gte = 
      parseFloat(this.queryString.priceMin) || 0;
      filterObject.price.$lte = 
      parseFloat(this.queryString.priceMax) || 340; // Default max price
    }

    this.query = this.query.find(filterObject);
    return this;
  }

  sort() {      
    if (this.queryString.sort) {
      this.queryString.sort.replace(/,/g, ' '); 
      this.query = this.query.sort(sortBy); 
       // same //sort(this.queryString.sort)
    } else { 
      this.query = this.query.sort('-createdAt'); // same
    }
    return this;
  }
    //  عندك متغير اسمه ليميت اعمل فيلد ليميت
  limitFields() { // limitFields use select ,questrin.filed
    if (this.queryString.field) {
      const fields = this.queryString.field.replace(/,/g, ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this; 
  }


  paginate(countDocuments) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 12;
    const skip = (page - 1) * limit; //for prev  // skip show what before  0 or products 
    const endIndex = page * limit; // for future   // num of proudcts  

    const pagination = {
      currentPage: page,
      limit,
      totalPages: Math.ceil(countDocuments / limit)
    };   

    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }     
        // this usefull to call var  in any place in class 
        // create Var buy this.newVar this.paginationResult = page
     // put pagint in instance class use this 
    this.query = this.query.skip(skip).limit(limit);
      // query at the end 
    this.paginationResult = pagination;

    return this;
  }
}

export default ApiFeatures;