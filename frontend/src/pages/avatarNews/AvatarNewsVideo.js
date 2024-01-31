import styles from "./AvatarNewsVideo.module.css";
import { useLoaderData, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../store/UserContext";

import config from '../../config/default'
const {REACT_APP_API_URL} = config;



const AvatarNewsVideo = () => {
  // Using React Router's loader data and a context for user management.
  const { article, error } = useLoaderData();
  const { setUser } = useUser();


  // Error handling and rendering logic.
  if (error) {
    const { message } = error;
    let errorMessage = (
      <h2>There was an error on the site. Please try to enter later.</h2>
    );
    if (message === "Authentication failed. Please log in.") {
      errorMessage = (
        <p className={styles.accessDeniedAlert}>
          In order to view the articles presented by avatars, you must{" "}
          <Link to="/login">log in</Link> or <Link to="/signup">register</Link>{" "}
          to the site.
        </p>
      );
      localStorage.removeItem("token");
      setUser();
    } else if (message === "Article not found.") {
      errorMessage = <h2>Article not found.</h2>;
    } else if (message === "Server error. Please try again later.") {
      errorMessage = <h2>Server error. Please try again later.</h2>;
    }
    return <div className={styles.articleContainer}> {errorMessage} </div>;
  }

  if (!article) {
    // In case an article was not found
    return (
      <div className={styles.articleContainer}>
        <h2>Article not found.</h2>
      </div>
    );
  }

  // Main component rendering.
  return (
    <div className={styles.avatarNewsVideoContainer}>
      {article ? (
        <div className={styles.videoWrapper}>
          <video controls>
            <source src={article.avatarVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h2>
            <FontAwesomeIcon icon={faVideo} /> {article.title}
          </h2>
        </div>
      ) : (
        <h2>There was an error on the site. Please try to enter later.</h2>
      )}
    </div>
  );
};

// Loader function for the React Router to fetch article data.
export const avatarNewsVideoLoader = async ({ params }) => {
  
  // Fetches and returns article data based on ID and user authentication token.
  const articleId = params.id;
  const token = localStorage.getItem("token");

    // Deny access if there's no token
  if (!token) {
    return { error: "Access Denied: No token provided." };
  }

  try {
    const response = await fetch(
      `${REACT_APP_API_URL}/news/article?id=${articleId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      let error = "Something went wrong";
      if (response.status === 401) {
        error = "Authentication failed. Please log in.";
      } else if (response.status === 404) {
        error = "Article not found.";
      } else if (response.status === 500) {
        const responseJson = await response.json();
        // Check if the error message from the server matches the specific token verification error
        if (
          responseJson.message ===
          "Token verification failed. Please provide a valid token."
        ) {
          error = "Authentication failed. Please log in.";
        } else {
          error = "Server error. Please try again later.";
        }
      }
      throw new Error(error);
    }

    const {article} = await response.json();
    return { article };
  } catch (error) {
    console.error("Failed to load blog:", error);
    return { error };
  }
}

export default AvatarNewsVideo;
