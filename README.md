# SocialConnect

## Overview

SocialConnect is a modern social media application that allows users to share posts, like and comment on posts, and interact with each other. This project demonstrates the use of React with TypeScript, along with various components from Material-UI for styling and layout.

## Live Site

You can access the live application here: [SocialConnect](https://social-app-silk-nine.vercel.app/)

## Features

- **User Profiles:** Each user has a profile with their information and posts.
- **Post Creation:** Users can create new posts with text and images.
- **Like and Comment:** Users can like posts and add comments.
- **Responsive Design:** The application is fully responsive and works seamlessly on both mobile and desktop devices.
- **Real-time Updates:** The application updates the post and comment sections in real-time to provide a smooth user experience.

## Components

### Homepage

The main entry point of the application where users can view the profile section, a widget section, and the post feed.

### PostCard

Displays individual posts with the author's information, content, images, likes, and comments. It includes the following sub-components:

- **Likes:** Handles the liking functionality for each post.
- **Comments:** Toggles the comment form visibility.
- **CommentForm:** Allows users to add new comments.
- **CommentList:** Displays the list of comments for each post.

## How It Works

1. **Fetching Posts:**
   The `Homepage` component fetches the posts from the backend API and passes them down to the `PostCard` component.
2. **Displaying Posts:**
   The `PostCard` component maps through the posts and renders each post with its details, including likes and comments.
3. **Adding Comments:**
   The `CommentForm` component handles the submission of new comments. On successful submission, it triggers a re-fetch of the posts to display the new comment.
4. **Real-time Updates:**
   The application uses `fetchPosts` to re-fetch the posts after actions like liking or commenting to ensure the UI stays up-to-date.

## Deployment

- **Frontend:** Deployed on Vercel. You can access the live site [here](https://social-app-silk-nine.vercel.app/).
- **Backend:** Deployed on Render.

## Technologies Used

The project utilizes the following technologies:

- **React:** Front-end library for building user interfaces.
- **TypeScript:** Superset of JavaScript for type safety and improved developer experience.
- **Material-UI:** Component library for fast and easy styling and layout.
- **Fetch API:** For making API requests to the backend.
- **AWS S3:** Cloud storage service used for storing images and other media assets.
- **Clerk:** User authentication service for managing user accounts and authentication.

## Status

The application is still in progress, with ongoing development and improvements.
