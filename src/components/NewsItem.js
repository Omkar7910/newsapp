import React from "react";
import "./NewsItem.css";

const NewsItem = (props) => {
  let { title, description, imageUrl, newsUrl, author, date, source } = props;

  return (
    <div className="news-item my-3">
      <div className="card">
        <div className="badge-container">
          <span className="badge rounded-pill bg-danger">{source}</span>
        </div>
        <img
          src={
            imageUrl
              ? imageUrl
              : "https://www.themehorse.com/wp-content/uploads/2018/11/newscard-screenshot.png"
          }
          className="card-img-top"
          alt={title}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-muted">
              By {author} on {new Date(date).toGMTString()}
            </small>
          </p>
          <a
            rel="noreferrer"
            href={newsUrl}
            target="_blank"
            className="btn btn-sm btn-primary read-more"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
