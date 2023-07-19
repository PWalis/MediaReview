import React from "react";

function CreatePost() {
  return (
    <div>
      <form>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" />
        <label htmlFor="content">Content</label>
        <textarea id="content" rows="5" />
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
