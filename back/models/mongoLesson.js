import { User } from "./userModel";

// make fun use async await only in create new no need 
// use try catch 

const createUsers = async () => {
  try {
    // // First method: Using new and save()
    // const userNew = new User({ 
    //   name: "Ali",
    //   age: 25
    // });
    // await userNew.save();
    // console.log('User created using save():', userNew);

    // Second method: Using create()
    const userNew_ = await User.create({ 
      name: "Ahmed",
      age: 30
    });
    console.log('User created using create():', userNew_);

  } catch (error) {
    console.error('Error creating users:', error);
  }
};

// Execute the function
createUsers();