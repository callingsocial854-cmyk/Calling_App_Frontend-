import React, { useState } from "react";
import "./MyQueries.css";
import { Link } from "react-router-dom";

const MyQueries = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Sample queries data
  const queries = [
    {
      id: 1,
      title: "How to implement drag and drop in React?",
      description:
        "I'm trying to implement a drag and drop feature for file uploads in my React application. Can someone help me with the best approach?",
      images: ["media/figure/sample1.jpg"],
      videos: [],
      queryType: "technical",
      status: "active",
      user: {
        name: "Rajesh Kumar",
        avatar: "media/figure/chat_5.jpg",
      },
      timestamp: "2 mins ago",
      privacy: "Friends",
      reactions: 25,
      comments: 2,
      shares: 5,
      commentsList: [
        {
          id: 1,
          user: {
            name: "Neha Gupta",
            avatar: "media/figure/chat_5.jpg",
          },
          text: "You can use react-dnd library for this. It's well maintained and has great documentation.",
          timestamp: "5 mins ago",
          reactions: 3,
        },
      ],
    },
    {
      id: 2,
      title: "CSS Grid layout issues",
      description:
        "Having trouble with CSS Grid responsive layout. The items are not aligning properly on mobile devices.",
      images: ["media/figure/sample1.jpg", "media/figure/sample1.jpg"],
      videos: [],
      queryType: "technical",
      status: "active",
      user: {
        name: "Priya Sharma",
        avatar: "media/figure/chat_5.jpg",
      },
      timestamp: "8 mins ago",
      privacy: "Personal",
      reactions: 35,
      comments: 2,
      shares: 5,
      commentsList: [],
    },
    {
      id: 3,
      title: "Payment gateway integration",
      description:
        "Need help integrating Stripe payment gateway with Node.js backend.",
      images: [],
      videos: ["media/figure/sample-video.mp4"],
      queryType: "billing",
      status: "inactive",
      user: {
        name: "Amit Patel",
        avatar: "media/figure/chat_5.jpg",
      },
      timestamp: "1 hour ago",
      privacy: "Friends",
      reactions: 15,
      comments: 0,
      shares: 2,
      commentsList: [],
    },
  ];

  const filteredQueries = queries.filter((query) => {
    if (activeFilter === "all") return true;
    return query.status === activeFilter;
  });

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
  };

  const handleCloseQuery = () => {
    setSelectedQuery(null);
    setCommentText("");
  };

  const handleAddComment = () => {
    if (commentText.trim() && selectedQuery) {
      console.log("Adding comment:", commentText);
      setCommentText("");
    }
  };

  const QueryDetailModal = ({ query, onClose }) => (
    <div className="query-detail-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{query.title}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="query-user-info">
            <img src={query.user.avatar} alt={query.user.name} />
            <div>
              <h4>{query.user.name}</h4>
              <span>{query.timestamp}</span>
            </div>
          </div>

          <div className="query-content">
            <p>{query.description}</p>

            {query.images.length > 0 && (
              <div className="query-images">
                <h4>Attached Images ({query.images.length})</h4>
                <div className="image-grid">
                  {query.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Attachment ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {query.videos.length > 0 && (
              <div className="query-videos">
                <h4>Attached Videos ({query.videos.length})</h4>
                <div className="video-grid">
                  {query.videos.map((video, index) => (
                    <video key={index} controls>
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              </div>
            )}

            <div className="query-meta">
              <span className={`status-badge ${query.status}`}>
                {query.status}
              </span>
              <span className="type-badge">{query.queryType}</span>
            </div>
          </div>

          <div className="comments-section">
            <h4>Comments ({query.commentsList.length})</h4>
            {query.commentsList.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-user">
                  <img src={comment.user.avatar} alt={comment.user.name} />
                  <div>
                    <h5>{comment.user.name}</h5>
                    <span>{comment.timestamp}</span>
                  </div>
                </div>
                <p>{comment.text}</p>
                <div className="comment-actions">
                  <button>Like</button>
                  <button>Reply</button>
                </div>
              </div>
            ))}

            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleAddComment}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="wrapper" className="wrapper">
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Filter Section */}
              <div
                className="block-box filter-tabs mb-4"
                style={{ width: "100%" }}
              >
                <div className="filter-header justify-content-between" style={{ width: "100%" }}>
                  <h3>My Queries</h3>
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${
                        activeFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter("all")}
                    >
                      All Queries
                    </button>
                    <button
                      className={`filter-btn ${
                        activeFilter === "active" ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter("active")}
                    >
                      Active
                    </button>
                    <button
                      className={`filter-btn ${
                        activeFilter === "inactive" ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter("inactive")}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* Queries List */}
              {filteredQueries.map((query) => (
                <div key={query.id} className="block-box post-view query-item">
                  <div className="post-header">
                    <div className="media">
                      <div className="user-img">
                        <img src={query.user.avatar} alt={query.user.name} />
                      </div>
                      <div className="media-body">
                        <div className="user-title">
                          <Link to="/myQueryDetail">{query.user.name}</Link>
                        </div>
                        <ul className="entry-meta">
                          <li className="meta-privacy">
                            <i className="icofont-users-alt-4" />
                            {query.privacy}
                          </li>
                          <li className="meta-time">{query.timestamp}</li>
                          <li className={`query-status ${query.status}`}>
                            {query.status}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle"
                        type="button"
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        ...
                      </button>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a className="dropdown-item">Edit</a>
                        <a className="dropdown-item">Delete</a>
                      </div>
                    </div>
                  </div>

                  <div className="post-body">
                    <div className="query-preview">
                      <h4
                        className="query-title"
                        onClick={() => handleQueryClick(query)}
                      >
                        {query.title}
                      </h4>
                      <p className="query-description">
                        {query.description.length > 150
                          ? `${query.description.substring(0, 150)}...`
                          : query.description}
                        {query.description.length > 150 && (
                          <span
                            className="read-more"
                            onClick={() => handleQueryClick(query)}
                          >
                            Read more
                          </span>
                        )}
                      </p>

                      {/* Media Previews */}
                      {(query.images.length > 0 || query.videos.length > 0) && (
                        <div className="media-previews">
                          {query.images.slice(0, 3).map((img, index) => (
                            <div key={index} className="media-preview">
                              <img src={img} alt={`Preview ${index + 1}`} />
                              {index === 2 && query.images.length > 3 && (
                                <div className="media-count">
                                  +{query.images.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                          {query.videos.slice(0, 1).map((video, index) => (
                            <div
                              key={`video-${index}`}
                              className="media-preview video"
                            >
                              <video>
                                <source src={video} type="video/mp4" />
                              </video>
                              <div className="play-icon">▶</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="query-meta-preview">
                        <span className="query-type">{query.queryType}</span>
                        <span className="attachments-count">
                          {query.images.length + query.videos.length}{" "}
                          attachments
                        </span>
                      </div>
                    </div>

                    <div className="post-meta-wrap">
                      <div className="post-meta">
                        <div className="post-reaction">
                          <div className="reaction-icon">
                            <img src="media/figure/reaction_1.png" alt="icon" />
                            <img src="media/figure/reaction_2.png" alt="icon" />
                            <img src="media/figure/reaction_3.png" alt="icon" />
                          </div>
                          <div className="meta-text">{query.reactions}</div>
                        </div>
                      </div>
                      <div className="post-meta">
                        <div
                          className="meta-text clickable"
                          onClick={() => handleQueryClick(query)}
                        >
                          {query.comments} Comments
                        </div>
                        <div className="meta-text">{query.shares} Share</div>
                      </div>
                    </div>
                  </div>

                  <div className="post-footer">
                    <ul>
                      <li className="post-react">
                        <a>
                          <i className="icofont-thumbs-up" />
                          React!
                        </a>
                        <ul className="react-list">
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_1.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_3.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_4.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_2.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_7.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_6.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <img
                                src="media/figure/reaction_5.png"
                                alt="Like"
                              />
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleQueryClick(query);
                          }}
                        >
                          <i className="icofont-comment" />
                          Comment
                        </a>
                      </li>
                      <li className="post-share">
                        <a className="share-btn">
                          <i className="icofont-share" />
                          Share
                        </a>
                        <ul className="share-list">
                          <li>
                            <a className="color-fb">
                              <i className="icofont-facebook" />
                            </a>
                          </li>
                          <li>
                            <a className="color-messenger">
                              <i className="icofont-facebook-messenger" />
                            </a>
                          </li>
                          <li>
                            <a className="color-instagram">
                              <i className="icofont-instagram" />
                            </a>
                          </li>
                          <li>
                            <a className="color-whatsapp">
                              <i className="icofont-brand-whatsapp" />
                            </a>
                          </li>
                          <li>
                            <a className="color-twitter">
                              <i className="icofont-twitter" />
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              <div className="block-box load-more-btn">
                <a className="item-btn">
                  <i className="icofont-refresh" />
                  Load More Queries
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <QueryDetailModal query={selectedQuery} onClose={handleCloseQuery} />
      )}
    </div>
  );
};

export default MyQueries;
