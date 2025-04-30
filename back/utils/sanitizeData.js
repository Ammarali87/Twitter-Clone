export const sanitizeUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
    };
};


// export const sanitizeUser = (user) => {
//     if (!user) {
//         return null;
//     }

//     // Basic data cleaning
//     const cleanName = user.name?.trim() || '';
//     const cleanEmail = user.email?.toLowerCase().trim() || '';

//     return {
//         id: user._id?.toString(),
//         name: cleanName,
//         email: cleanEmail,
//         role: user.role || 'user',
//         createdAt: user.createdAt
//     };
// };
