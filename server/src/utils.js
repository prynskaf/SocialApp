// USERS COLLECTIONS
// This collection will store user information. Each document in this collection 
// represents a user and contains fields for their
//  profile picture, and arrays for their posts and likes.
{
    "_id": "ObjectId",
        "firstName": "String",
            "lastName": "String",
                "userImage": "String", // URL to the profile picture image
                    "posts": ["ObjectId"], // Array of post IDs
                        "likes": ["ObjectId"], // Array of like IDs
                            "createdAt": "Date", // Recommended to track creation
                                "updatedAt": "Date" // Recommended to track last update
}


// POST COLLECTION
// This collection will store posts made by users. Each document in this collection
//  represents a post and contains fields for the user who made the post, the content 
//  of the post, 
// any associated image, arrays for likes and comments, and a timestamp.
{
    "_id": "ObjectId",
        "user_id": "ObjectId", // Reference to the User collection
            "content": "String", // Text content of the post
                "imageUrls": ["String"], // List of URLs to images associated with the post
                    "comments": ["ObjectId"], // Array of comment IDs
                        "likes": ["ObjectId"], // Array of like IDs
                            "timestamp": "Date" // Consider renaming to createdAt for consistency
}


//COMMENT COLLECTIONS
// This collection will store comments made on posts. Each document in this collection represents a 
// comment and contains fields for the user who made the comment,
//  the post on which the comment was made, the content of the comment, and a timestamp.
{
    "_id": "ObjectId",
        "user_id": "ObjectId", // Reference to the User collection
            "post_id": "ObjectId", // Reference to the Post collection
                "timestamp": "Date" // Consider renaming to createdAt for consistency
}




// LIKE COLLECTION
// This collection will store likes on posts. Each document in this collection 
// represents a like and contains fields 
// for the user who liked the post, the post that was liked, and a timestamp.
{
    "_id": ObjectId,
        "user_id": ObjectId, // ID of the user who liked the post
            "post_id": ObjectId, // ID of the post that was liked
                "timestamp": Date
}



// API DOCUMENTATION
/*
https://web.postman.co/documentation/29066923-851f2221-c55f-404f-84b6-fa1548775519/publish?workspaceId=250f2026-8864-42e0-8f71-d9f42d7eb718
*/